import 'dotenv/config';
// import {Game} from 'lib-mongoose';
import {updateGameByDayLimit} from '../app/creator/createGame';

const seedGame = async () => {
  console.log('Seeding started!');
  await updateGameByDayLimit();
  // const gameCount = await Game.count();
  // if (gameCount === 0) {
  //   console.log('creating...');
  // } else {
  //   console.log('updating...');
  //   await updateGameByADay();
  // }
  console.log('Done!');
  process.exit();
};

seedGame();
