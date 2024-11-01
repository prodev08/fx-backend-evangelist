import '../initializers';
import {User} from 'lib-mongoose';
import supportLockerRoom from '../app/creator/supportLockerRoom';

async function main(lockerRoomId: string) {
  const users = await User.find({}).exec();
  const userCount = users.length;
  let i = 1;
  for (const user of users) {
    console.log(`${i}/${userCount}`);
    const userID = user.id.toString();
    const uid = user.uid;
    await supportLockerRoom(lockerRoomId, userID, uid);
    i++;
  }
  console.log('Done!');
}

main('6380e27e1e91d4ef16439fb1');
