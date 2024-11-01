import {LockerRoom} from 'lib-mongoose';

export default async function (group: string) {
  return await LockerRoom.findOne({group}).exec();
}
