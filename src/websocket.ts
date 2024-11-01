import {Message, MessageDocument, User} from 'lib-mongoose';
import getMessagesByChannelSlug from './app/getter/getMessagesByChannelSlug';
import moment from 'moment';
import getDerivedPhotoURL from './app/getter/getDerivedPhotoURL';
import addReadMessage from './app/creator/addReadMessage';
import {auth} from 'lib-api-common';
import getSupportedLockerRooms from './app/getter/getSupportedLockerRooms';
import sendMessage from './app/creator/sendMessage';
import deleteMessage from './app/creator/deleteMessage';
import editMessage from './app/creator/editMessage';

// Redis
import {createAdapter} from '@socket.io/redis-adapter';
import {createClient} from 'redis';
import getUser from './app/getter/getUser';

export default async function (server: any) {
  // Static Data
  let users: any = [];
  const typings: any = [];
  const channelOnlines: any = [];
  // END Static Data

  //Server Configuration
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    // keepAlive: true,
  });
  // END Server Configuration

  //Redis Initialize
  if (global.redisURL) {
    const pubClient = createClient({url: global.redisURL});
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log('Connected to Socket Redis Adapter');
      })
      .catch(e => {
        console.log(e);
      });
  }
  //END Redis

  // Initialize Connection
  io.on('connection', (socket: any) => {
    // On connect start sending ping events
    // setInterval(() => {
    //   socket.emit('ping', 'connect');
    //   emitLogs({
    //     call: 'ping',
    //     payload: 'connect',
    //   });
    // }, 5000);
    // socket io auth
    const token = socket.handshake?.auth?.token || null;
    const type = socket.handshake?.auth?.type || 'desktop';

    socket.on('ping', async () => {
      await auth.validateToken(token, global.firebaseBE);
    });
    // Online Subscription
    // --- Whenever someone connects this piece of code executed
    socket.on('subscribe', async ({User}: any, cb: any) => {
      emitLogs({
        call: 'subscribe',
        payload: User,
      });

      emitLogs({
        call: 'token-value',
        payload: token,
      });

      const user = {
        User,
        id: socket.id,
      };

      if (token) {
        const lockerRooms = await getLockerRooms(token);
        const lockerSlug =
          lockerRooms?.map(e => {
            return e.slug;
          }) || [];
        if (lockerSlug.length) socket.join(lockerSlug);

        emitLogs({
          call: 'subscribe-lockerRooms',
          payload: lockerRooms,
        });

        // for mentions and reply
        const {userID} = await auth.validateToken(token, global.firebaseBE);
        try {
          await User.findByIdAndUpdate(userID, {online: true});
        } catch (err) {
          console.log(err);
        }
        if (userID) socket.join(userID);
      }

      users = users.filter((u: any) => u.id !== socket.id);
      users.push(user);

      io.emit('status-online', users);
      cb(!!User);

      console.log(`connected user list ${users.toString()}`);
    });
    // END Online Subscription

    // Room events
    socket.on('join-channel', async ({channelSlug}: any, cb: any) => {
      emitLogs({
        call: 'join-channel',
        payload: {
          channel: `channel: ${channelSlug}`,
          id: socket.id,
        },
      });
      socket.join(channelSlug);

      if (token) {
        await readMessages(channelSlug, token);
        const uid = await getUserUID(token);
        if (uid) {
          const User = await getUser(uid);
          if (!channelOnlines[channelSlug]) channelOnlines[channelSlug] = [];

          const channelOnlineData = channelOnlines[channelSlug];

          if (channelOnlineData.find((x: any) => x.User.uid === User?.uid)) {
            const objIndex = channelOnlineData.findIndex((obj: any) => obj.User.uid === User?.uid);
            channelOnlineData[objIndex].isOnline = true;
            channelOnlineData[objIndex].User = User;
          } else {
            await channelOnlineData.push({
              User,
              isOnline: true,
              id: socket.id,
            });
          }
          const onlineUsers = await getChannelOnlineUsers(channelOnlineData);
          // const sent = socket.to(channelSlug).emit('on-channel-user-online', {onlineUsers, channelSlug});
          socket.emit('on-channel-user-online', {onlineUsers, channelSlug});
          emitLogs({
            call: 'on-channel-user-online',
            payload: {
              onlineUsers,
              channelSlug,
            },
          });
          // cb(sent);
        }
      }

      cb(await getLatestMessagesByChannel(channelSlug, type));
    });

    socket.on('leave-channel', async ({channelSlug}: any) => {
      emitLogs({
        call: 'leave-channel',
        payload: {
          channel: `channel: ${channelSlug}`,
          id: socket.id,
        },
      });
      socket.leave(channelSlug);
      if (token) {
        await readMessages(channelSlug, token);
        const uid = await getUserUID(token);
        if (uid) {
          const User = await getUser(uid);

          if (!channelOnlines[channelSlug]) channelOnlines[channelSlug] = [];

          const channelOnlineData = channelOnlines[channelSlug];

          if (channelOnlineData.find((x: any) => x.User.uid === User?.uid)) {
            const objIndex = channelOnlineData.findIndex((obj: any) => obj.User.uid === User?.uid);
            channelOnlineData[objIndex].isOnline = false;
            channelOnlineData[objIndex].User = User;
          } else {
            await channelOnlineData.push({User, id: socket.id});
          }

          const onlineUsers = await getChannelOnlineUsers(channelOnlineData);
          // const sent = socket.to(channelSlug).emit('on-channel-user-online', {onlineUsers, channelSlug});
          socket.emit('on-channel-user-online', {onlineUsers, channelSlug});
          emitLogs({
            call: 'on-channel-user-online',
            payload: {
              onlineUsers,
              channelSlug,
            },
          });
          // cb(sent);
        }
      }
    });
    // END Room Events

    // Messages
    socket.on(
      'send-message',
      async ({channelSlug, text, User, repliedTo, chatID, lockerRoomSlug, Media, MentionedUserIDs}: any, cb: any) => {
        emitLogs({
          call: 'send-message-token',
          payload: token,
        });
        const userID = User.id;
        const repliedToUserID = repliedTo?.User?.id || null;
        const repliedToChatID = repliedTo?.chatID || null;
        const date = moment().toISOString();

        let error = null;
        await sendMessage(null, userID, channelSlug, text, chatID, repliedToChatID, Media, MentionedUserIDs).catch(
          e => {
            error = e;
          }
        );

        if (!error) {
          socket.to(channelSlug).emit('on-message', {
            chat: {
              channelSlug,
              text,
              User,
              date,
              repliedTo,
              chatID,
              Media: Media ? await getMediaPhotoURLs(Media, type) : null,
            },
          });
          emitLogs({
            call: 'on-message',
            payload: {
              channelSlug,
              text,
              User,
              date,
              Media: Media ? await getMediaPhotoURLs(Media, type) : null,
              repliedTo,
            },
          });

          // SEND IF REPLY HAS A ID
          if (repliedToUserID) socket.to(repliedToUserID).emit('status-notify-mentions');
          MentionedUserIDs.map((userID: any) => {
            socket.to(userID).emit('status-notify-mentions');
            emitLogs({
              call: 'status-notify-mentions',
              payload: {userID},
            });
          });
        }

        if (lockerRoomSlug) socket.to(lockerRoomSlug).emit('status-notify');

        emitLogs({
          call: 'status-notify',
          payload: {lockerRoomSlug},
        });

        return cb(!error);
      }
    );
    // END Messages

    // Edit Message
    socket.on(
      'edit-message',
      async ({channelSlug, chatID, text, repliedToChatID, Media, MentionedUserIDs}: any, cb: any) => {
        if (token) {
          let error = null;
          const {uid} = await auth.validateToken(token, global.firebaseBE);
          if (!uid) return;
          editMessage(chatID, text, repliedToChatID, Media, uid, MentionedUserIDs).catch(e => {
            error = e;
          });
          if (!error) {
            socket.to(channelSlug).emit('on-edit-message', {
              chat: {
                chatID,
                text,
                repliedToChatID,
                Media,
              },
            });
          }
          emitLogs({
            call: 'on-edit-message',
            payload: {
              chat: {
                channelSlug,
                chatID,
                text,
                repliedToChatID,
                Media,
              },
            },
          });

          return cb(!error);
        }
      }
    );
    // END Edit Message

    //Delete Message
    socket.on('delete-message', async ({channelSlug, chatID, isDeletedSelf, isDeletedEveryone}: any, cb: any) => {
      if (token) {
        let error = null;
        const {uid} = await auth.validateToken(token, global.firebaseBE);
        if (!uid) return;
        deleteMessage(chatID, isDeletedSelf, isDeletedEveryone, uid).catch(e => {
          error = e;
        });
        if (!error) {
          socket.to(channelSlug).emit('on-delete-message', {
            chat: {
              chatID,
              isDeletedSelf,
              isDeletedEveryone,
            },
          });
        }
        emitLogs({
          call: 'on-delete-message',
          payload: {
            chat: {
              channelSlug,
              chatID,
              isDeletedSelf,
              isDeletedEveryone,
            },
          },
        });

        return cb(!error);
      }
    });
    //END Delete Message

    // Typing Message
    socket.on('typing-message', async ({channelSlug, userName, isTyping}: any, cb: any) => {
      if (!typings[channelSlug]) typings[channelSlug] = [];

      const channelData = typings[channelSlug];

      if (channelData.find((x: any) => x.userName === userName)) {
        const objIndex = channelData.findIndex((obj: any) => obj.userName === userName);
        channelData[objIndex].isTyping = isTyping;
        channelData[objIndex].userName = userName;
      } else {
        await channelData.push({userName, isTyping, id: socket.id});
      }

      const typingUsers = await getChannelTypingUsers(channelData);
      const sent = socket.to(channelSlug).emit('on-typing-message', typingUsers);
      emitLogs({
        call: 'on-typing-message',
        payload: {
          typingUsers,
        },
      });
      cb(sent);
    });
    // END Typing Message

    // --- Whenever someone disconnects this piece of code executed
    socket.on('disconnect', async () => {
      emitLogs({
        call: 'disconnect',
        payload: {id: socket.id},
      });

      // REMOVE ONLINE STATUS
      const id = socket.id;
      users = users.filter((u: any) => u.id !== id);
      io.emit('status-online', users);
      const {userID} = await auth.validateToken(token, global.firebaseBE);
      try {
        await User.findByIdAndUpdate(userID, {online: false});
      } catch (err) {
        console.log(err);
      }

      // REMOVE TYPING STATUS
      const keys = Object.keys(typings);
      keys.forEach((e: any) => {
        const indexOfObject = typings[e]?.findIndex((object: any) => {
          return object.id === id;
        });
        if (indexOfObject !== -1) {
          typings[e]?.splice(indexOfObject, 1);
        }
      });
    });

    function emitLogs({call, payload}: any) {
      io.emit('logs', {
        call,
        payload,
      });
    }
  });
}

async function getUserUID(token: string) {
  const {uid} = await auth.validateToken(token, global.firebaseBE);
  return uid;
}

async function getLatestMessagesByChannel(channelSlug: string, type: string) {
  return await Promise.all(
    (
      await getMessagesByChannelSlug(channelSlug, 10, 0)
    ).map(async (item: MessageDocument) => {
      const user = await User.findById(item.userID, {username: 1, Avatar: 1}).exec();
      let repliedTo = null;
      if (item.repliedToChatID) {
        const reply = await Message.findOne(
          {chatID: item.repliedToChatID},
          {
            text: 1,
            userID: 1,
            createdAt: 1,
            chatID: 1,
          }
        ).exec();
        const repliedToName = (await User.findById(reply?.userID, {username: 1}).exec())?.username;
        repliedTo = {
          text: reply?.text,
          User: {
            username: repliedToName,
          },
          date: moment(reply?.createdAt).toISOString(),
          chatID: reply?.chatID,
        };
      }

      return {
        channelSlug,
        text: item.text,
        User: {
          username: user?.username,
          Avatar: {
            PhotoURL: user?.Avatar?.objectID ? await getDerivedPhotoURL(user.Avatar.objectID) : null,
            objectID: user?.Avatar?.objectID || null,
          },
          id: item.userID,
        },
        Media: item.Media ? await getMediaPhotoURLs(item.Media, type) : null,
        date: moment(item.createdAt).toISOString(),
        chatID: item.chatID,
        repliedTo,
      };
    })
  );
}

async function readMessages(channelSlug: string, token: string) {
  const {uid} = await auth.validateToken(token, global.firebaseBE);
  if (!uid) return;
  await addReadMessage(uid, channelSlug);
}

async function getLockerRooms(token: string) {
  const {uid} = await auth.validateToken(token, global.firebaseBE);
  if (!uid) return;
  return await getSupportedLockerRooms(uid!);
}

async function getMediaPhotoURLs(Media: Array<any>, type: string) {
  if (!Media) return;
  const MediaList: any = [];
  const size = type === 'desktop' ? '640x360' : '200sq';
  for (const item of Media) {
    item.PhotoURL = await getDerivedPhotoURL(item.objectID, false, size);
    item.isSport = false;
    MediaList.push(item);
  }
  return MediaList;
}

async function getChannelTypingUsers(channel: any) {
  const filteredUsers = channel.filter((obj: any) => obj.isTyping === true);
  if (filteredUsers.length === 0) {
    return [];
  } else {
    return filteredUsers
      .map((e: any) => {
        return e.userName;
      })
      .filter(Boolean);
  }
}

async function getChannelOnlineUsers(channel: any) {
  const filteredUsers = channel.filter((obj: any) => obj.isOnline === true);
  if (filteredUsers.length === 0) {
    return [];
  } else {
    return filteredUsers.map((e: any) => {
      return e.User;
    });
    // .filter(Boolean);
  }
}
