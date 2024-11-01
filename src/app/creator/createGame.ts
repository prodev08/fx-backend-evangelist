import {apiGames, getGames} from '../../areYouWatchingThis';
import {Game, GamePartner} from 'lib-mongoose';
import createGamePartner from './createGamePartner';
import createGameLockerRoom from './createGameLockerRoom';

const DAY_LIMIT = 15;
const ONE_DAY_TIME = 86400000;
const ONE_MINUTE_TIME = 60000;
const sports = ['mlb', 'wnba', 'nba', 'ncaab', 'nhl', 'soccer'];

const updateGameWithTime = async (startDate: number, endDate: number) => {
  for (const sport of sports) {
    const games = await getGames({startDate, endDate, sport});
    for (const game of games) {
      const existGame = await Game.findOne({gameID: game.gameID});
      if (existGame) {
        await existGame.updateOne(game);
      } else {
        const newGame = await Game.create(game);
        await createGameLockerRoom(newGame);
      }
      console.log(game.gameID, ' added');
    }
  }
};

export const updateIndividualGame = async () => {
  const currentTime = new Date().getTime();
  const twoMinuteBeforeTime = currentTime - ONE_MINUTE_TIME * 2;
  const results = await Game.find({
    $and: [{date: {$gt: twoMinuteBeforeTime}}, {date: {$lt: currentTime}}],
  });

  for (const game of results) {
    if (game.links!.length! > 0 && game.timeLeft!) return;
    const newGame = await apiGames({gameID: game.gameID});

    if (newGame.length === 0) return;
    delete newGame[0].gameID;
    await game.update(newGame[0]);
  }
};

export const updateGameByADay = async () => {
  const currentTime = new Date().getTime() + DAY_LIMIT * ONE_DAY_TIME;
  const endTime = currentTime + ONE_DAY_TIME;
  await updateGameWithTime(currentTime, endTime);

  await GamePartner.deleteMany({});
  await createGamePartner();
};

export const updateGameByDayLimit = async () => {
  let startDate = new Date().getTime() - ONE_DAY_TIME / 4;
  let endDate = startDate + ONE_DAY_TIME;

  for (let i = DAY_LIMIT; i > 0; i--) {
    try {
      await updateGameWithTime(startDate, endDate);
      startDate += ONE_DAY_TIME;
      endDate += ONE_DAY_TIME;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  await GamePartner.deleteMany({});
  await createGamePartner();
};
