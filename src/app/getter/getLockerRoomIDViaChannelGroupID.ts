import {ChannelGroup} from 'lib-mongoose';

export default async function (channelGroupID: string) {
  return (await ChannelGroup.findById(channelGroupID).exec())?.lockerRoomID;
}
