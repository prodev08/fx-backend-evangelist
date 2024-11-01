import {UserRole} from 'lib-mongoose';

export default async function (lockerRoomID: string, uid?: string | null) {
  return ((await UserRole.find({uid, lockerRoomID})) || []).length > 0;
}
