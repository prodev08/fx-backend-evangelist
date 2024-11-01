import {Channel} from 'lib-mongoose';
import stringToSlug from '../transform/stringToSlug';
import {IInputCreateChannel} from '../../nexus/schema/mutations';
import incrementGroupAggregates from './incrementGroupAggregates';
import channelGroupIDExists from '../checker/channelGroupIDExists';

/*
Channel Creation
1. Create the Channel doc.
2. If not successful, expect an error.
3. Then, increment the GroupAggregate of the LockerRoom/League/Club/Sports to which this Channel belongs to.
 */

export default async function (input: IInputCreateChannel, lockerRoomID: string) {
  const group = (await channelGroupIDExists(input.channelGroupID)).group;
  const name = input!.name;
  // 1. Create the Channel doc.
  const slug = await stringToSlug(Channel, name, false, true, false);
  // 2. If not successful, expect an error.
  const result = await Channel.create({...input, slug, lockerRoomID});
  if (result) {
    // 3. Then, increment the GroupAggregate of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
    await incrementGroupAggregates('channels', 1, {group, id: result.id, lockerRoomID});
  }
  return result;
}
