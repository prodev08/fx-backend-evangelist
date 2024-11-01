import {LockerRoom} from 'lib-mongoose';
import supportLockerRoom from './supportLockerRoom';

export default async function (userID: string | null | undefined, uid: string | null | undefined) {
  const fx1LockerRoomID = (await LockerRoom.findOne({slug: 'fx-1-support'}).exec())?.id;
  await supportLockerRoom(fx1LockerRoomID, userID, uid);
}
