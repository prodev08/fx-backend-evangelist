import '../initializers';
import {Channel, ChannelGroup, Game, GroupAggregates, LockerRoom, Message} from 'lib-mongoose';

async function main() {
  const gameLockerRooms = await LockerRoom.find({group: /^Game:/}).exec();
  const length = gameLockerRooms.length;
  let i = 1;
  for (const gameLockerRoom of gameLockerRooms) {
    console.log(`${i}/${length}`);
    const group = gameLockerRoom.group;
    console.log(group);
    const lockerRoomID = gameLockerRoom.id;
    const [, objectID] = group.split(':');
    const gameExists = await Game.findOne({gameID: objectID}).exec();
    if (gameExists) {
      console.log('Game exists.');
      console.log('Renaming locker room...');
      const team1Name = gameExists.team1Name ? gameExists.team1Name : gameExists.team1City;
      const team2Name = gameExists.team2Name ? gameExists.team2Name : gameExists.team2City;
      await LockerRoom.findOneAndUpdate(
        {group},
        {
          name: `${gameExists.leagueCode.toUpperCase()}: ${team1Name?.toUpperCase()} vs ${team2Name?.toUpperCase()}`,
        }
      ).exec();
    } else {
      console.log('Game does not exist.');
      //delete locker room
      console.log('Deleting locker room...');
      await LockerRoom.findOneAndDelete({group}).exec();
      //delete group aggregates
      console.log('Deleting group aggregates...');
      await GroupAggregates.findOneAndDelete({group}).exec();
      await GroupAggregates.findOneAndDelete({group: `LockerRoom:${lockerRoomID}`}).exec();
      //delete channel group
      console.log('Deleting channel group...');
      const channelGroupID = (await ChannelGroup.findOneAndDelete({group}).exec())?.id;
      //delete channel
      console.log('Deleting channel...');
      const channelSlug = (await Channel.findOneAndDelete({channelGroupID}).exec())?.slug;
      //delete message
      console.log('Deleting messages...');
      await Message.deleteMany({channelSlug}).exec();
    }
    console.log('-----');
    i++;
  }
  console.log('Done!');
}

main();
