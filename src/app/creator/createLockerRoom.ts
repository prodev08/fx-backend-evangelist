import stringToSlug from '../transform/stringToSlug';
import {GroupAggregates, LockerRoom} from 'lib-mongoose';

export default async function (name: string, group: string) {
  const lockerRoomSlug = await stringToSlug(LockerRoom, name, false, true, false);
  const lockerRoomResult = await LockerRoom.create({
    name,
    slug: lockerRoomSlug,
    group,
  });
  await GroupAggregates.create({
    group: `LockerRoom:${lockerRoomResult.id}`,
  });
  return lockerRoomResult;
}
