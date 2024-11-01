import {ChannelGroup} from 'lib-mongoose';
import stringToSlug from '../transform/stringToSlug';
import {IInputCreateChannelGroup} from '../../nexus/schema/mutations';
import incrementGroupAggregates from './incrementGroupAggregates';

/*
Channel Group Creation
1. Create the Channel Group doc.
2. If not successful, expect an error.
3. Then, increment the GroupAggregate (channelGroups) of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
 */

export default async function (input: IInputCreateChannelGroup, group: string) {
  const name = input!.name;
  const lockerRoomID = input!.lockerRoomID;
  // 1. Create the Channel Group doc.
  const slug = await stringToSlug(ChannelGroup, name, false, true, false);
  // 2. If not successful, expect an error.
  const result = await ChannelGroup.create({...input, group, slug, lockerRoomID});
  if (result) {
    // 3. Then, increment the GroupAggregate (channelGroups) of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
    await incrementGroupAggregates('channelGroups', 1, {group, id: result.id, lockerRoomID});
  }
  return result;
}
