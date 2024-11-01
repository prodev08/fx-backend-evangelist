import '../initializers';
import {Channel, ChannelGroup, LockerRoom} from 'lib-mongoose';

async function main() {
  const lockerRooms = await LockerRoom.find({}).exec();
  for (const lockerRoom of lockerRooms) {
    const lockerRoomID = lockerRoom.id;
    const channelGroups = await ChannelGroup.find({lockerRoomID}).exec();
    for (const channelGroup of channelGroups) {
      const channelGroupID = channelGroup.id;
      await Channel.updateMany({channelGroupID}, {lockerRoomID});
    }
  }
  console.log('Done!');
}

main();
