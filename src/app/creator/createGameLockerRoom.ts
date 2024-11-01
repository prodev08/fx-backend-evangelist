import {GameDocument, GroupAggregates, LockerRoom} from 'lib-mongoose';
import createLockerRoom from './createLockerRoom';
import createDefaultChannelGroupAndChannels from './createDefaultChannelGroupAndChannels';

export default async function (game: GameDocument) {
  const group = `Game:${game.gameID}`;
  const existingLockerRoom = await LockerRoom.findOne({group}).exec();
  if (!existingLockerRoom) {
    console.log('Creating stuff...');
    // Create group aggregates
    await GroupAggregates.create({group});
    // Create locker room
    const team1Name = game.team1Name ? game.team1Name : game.team1City;
    const team2Name = game.team2Name ? game.team2Name : game.team2City;
    const lockerRoomResult = await createLockerRoom(
      `${game.leagueCode.toUpperCase()}: ${team1Name?.toUpperCase()} vs ${team2Name?.toUpperCase()}`,
      group
    );
    // Create default channel group and channels
    await createDefaultChannelGroupAndChannels(lockerRoomResult.id, group);
  } else {
    console.log('LockerRoom found. Skipping...');
  }
  console.log('-----');
}
