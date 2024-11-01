import '../initializers';
import {Message, User, UserRole} from 'lib-mongoose';
import {AuthenticationError} from 'apollo-server-express';
import getDerivedPhotoURL from '../app/getter/getDerivedPhotoURL';

interface ISetProfile {
  username: string;
  emailAddress: string;
  avatarObjectID?: string | null;
  uid: string;
  userID: string;
}

async function setProfileScript(data: ISetProfile) {
  const {username: Username, emailAddress, avatarObjectID, uid: distinct_id, userID} = data;
  if (!distinct_id) {
    throw new AuthenticationError('Distinct ID is empty.');
  }
  const avatar = avatarObjectID ? await getDerivedPhotoURL(avatarObjectID) : null;
  const supportCount = await UserRole.countDocuments({uid: distinct_id});
  const sentMessageCount = await Message.count({userID});
  await mixpanel.people.set(distinct_id!, {
    Username,
    $email: emailAddress,
    $avatar: avatar,
    'Locker Rooms Supported': supportCount,
    'Messages Sent': sentMessageCount,
  });
}

async function main() {
  const users = await User.find().exec();
  const length = users.length;
  let i = 1;
  for (const user of users) {
    console.log(`${i}/${length}`);
    let avatarObjectID;
    const {username, emailAddress, uid, id: userID} = user;
    if (user.Avatar) {
      avatarObjectID = user.Avatar.objectID;
    }
    await setProfileScript({username, emailAddress, avatarObjectID, uid, userID});
    console.log('User', `${username} + ${uid}`);
    i++;
  }
  console.log('Done!');
}

main();
