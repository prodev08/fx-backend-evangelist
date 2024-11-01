import {Game} from 'lib-mongoose';
import createGameLockerRoom from '../app/creator/createGameLockerRoom';

async function main() {
  const games = await Game.find({}).exec();
  const length = games.length;
  let i = 1;
  for (const game of games) {
    console.log(`${i}/${length}`);
    console.log(`Game:${game.gameID}`);
    await createGameLockerRoom(game);
    i++;
  }
  console.log('Done!');
}

main();
