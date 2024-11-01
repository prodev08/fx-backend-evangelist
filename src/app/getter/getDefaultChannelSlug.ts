import {Channel} from 'lib-mongoose';
import {channelFilter} from '../../utilities';

export default async function (lockerRoomID: string) {
  // const channelGroupID = (
  //   await ChannelGroup.findOne({...channelGroupFilter, lockerRoomID})
  //     .sort({createdAt: 1})
  //     .exec()
  // )?.id;
  // if (!channelGroupID) {
  //   return null;
  // }
  const defaultChannel = await Channel.findOne({...channelFilter, lockerRoomID})
    .sort({createdAt: 1})
    .exec();
  return defaultChannel ? defaultChannel.slug : null;
  // return global.lockerRoomIDToDefaultSlug[id];
}
