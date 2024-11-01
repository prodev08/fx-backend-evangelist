import {Channel, ChannelDocument} from 'lib-mongoose';
import {channelFilter} from '../../utilities';

export default async function (lockerRoomID: string) {
  // const channelGroupIDs = (await ChannelGroup.find({...channelGroupFilter, lockerRoomID}).exec()).map(
  //   (item: ChannelGroupDocument) => item.id
  // );
  return (await Channel.find({...channelFilter, lockerRoomID}).exec()).map((item: ChannelDocument) => item.slug);
}
