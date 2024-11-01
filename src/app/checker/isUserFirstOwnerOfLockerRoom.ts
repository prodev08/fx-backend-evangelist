import {UserRole} from 'lib-mongoose';

export default async function (lockerRoomID: string) {
  let ownerLockerRoom = false;
  const existingIsPrimaryOwner = await UserRole.findOne({
    lockerRoomID,
    isPrimaryOwner: true,
  }).exec();
  if (!existingIsPrimaryOwner) {
    ownerLockerRoom = true;
  }
  return ownerLockerRoom;
}
