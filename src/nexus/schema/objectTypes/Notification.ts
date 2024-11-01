import {objectType} from 'nexus';
import {LockerRoom, Message} from 'lib-mongoose';

export const Notification = objectType({
  name: 'Notification',
  description: 'This is viewable on the specified owner of the targetUserID.',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.nonNull.string('actorUserID', {
      description: 'This is the userID of the one who replied or mentioned a user.',
    });
    t.nonNull.string('actorUid', {
      description: 'This is the uid of the one who replied or mentioned a user.',
    });
    t.nonNull.string('targetUserID', {
      description: 'This is the userID of the one who got replied to or mentioned.',
    });
    t.nonNull.string('targetUid', {
      description: 'This is the uid of the one who got replied to or mentioned.',
    });
    t.nonNull.string('messageID', {
      description: 'This is the messageID of the reply or where a user got mentioned.',
    });
    t.nonNull.string('chatID', {
      description: 'This is the chatID of the reply or where a user got mentioned.',
    });
    t.nonNull.string('channelSlug');
    t.nonNull.string('type');
    t.boolean('isRead');
    t.boolean('isSeen');

    t.nonNull.string('channelName', {
      resolve: async ({channelSlug: slug}, args, {loaders}) => {
        return (await loaders?.findChannelBySlug.load(slug))?.name || 'FX1 Channel';
      },
    });
    t.nonNull.field('LockerRoom', {
      type: 'LockerRoom',
      resolve: async ({channelSlug: slug}, args, {loaders}) => {
        const lockerRoomID = (await loaders?.findChannelBySlug.load(slug))?.lockerRoomID;
        return (await LockerRoom.findById(lockerRoomID).exec())!;
      },
    });
    t.nonNull.field('Actor', {
      type: 'User',
      resolve: async ({actorUserID}, args, {loaders}) => {
        return (await loaders?.findUserByID.load(actorUserID))!;
      },
    });
    t.nonNull.field('Message', {
      type: 'Message',
      resolve: async ({messageID}) => {
        return (await Message.findById(messageID).exec())!;
      },
    });
  },
});
