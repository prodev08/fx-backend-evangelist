import {CronJob} from 'cron';
import {Game, GameDocument} from 'lib-mongoose';
import {URLSearchParams} from 'url';
import {getDataWithMultiParams, getImageUrl} from '../../areYouWatchingThis';
import {updateGameByDayLimit} from '../creator/createGame';
// import {ILink} from '../../interfaces/IGame';

const CYCLE_DAILY = '0 0 * * *';
const CYCLE_HOURLY = '0 * * * *';
const CYCLE_MINUTE = (min: number) => `*/${min} * * * *`;

const gameUpdateFromAUWT = async (games: GameDocument[]) => {
  if (!games || games.length === 0) return;

  // 1. Make params to fetch data for multiple games and assets.
  const params = new URLSearchParams();
  games.forEach(game => {
    if (game.gameID) params.append('gameID', game.gameID.toString());
  });
  params.append('apiKey', process.env.ARE_YOU_WATCHING_THIS_API_KEY!.toString());
  const fetchedGames = await getDataWithMultiParams(process.env.ARE_YOU_WATCHING_THIS_URL + '/games.json')(params);
  const fetchedAssets = await getDataWithMultiParams(process.env.ARE_YOU_WATCHING_THIS_URL + '/assets.json')(params);

  // 2. Update only gameID, date, timeLeft, team1Score, team2Score, and coverImage for each games.
  for (const fetchedGame of fetchedGames) {
    const {gameID, date, timeLeft, team1Score, team2Score} = fetchedGame;
    const asset = fetchedAssets.find((ele: any) => ele.gameID === gameID);
    const coverImage = asset ? getImageUrl(asset.assetID) : null;
    // const gameLinks = fetchedLinks.find((fetchedLink: any) => fetchedLink.gameID === gameID);
    // let links: ILink[] = [];
    // if (gameLinks.links?.length > 0) {
    //   links = links.concat(...gameLinks.links);
    //   links = links.filter(link => link.type !== 'audio');
    // }
    if (coverImage) Game.updateOne({gameID}, {date, timeLeft, team1Score, team2Score, coverImage}).exec();
    else Game.updateOne({gameID}, {date, timeLeft, team1Score, team2Score}).exec();
  }
};

export const cronJobForGameUpdatingDaily = new CronJob(CYCLE_DAILY, updateGameByDayLimit);

export const cronJobForLiveGameUpdating = new CronJob(CYCLE_MINUTE(1), async () => {
  const currentTime = new Date().getTime();
  const liveGames: GameDocument[] = await Game.find({timeLeft: {$nin: [null, '', /^Final/]}});
  const justStartedGames: GameDocument[] = await Game.find({date: {$lt: currentTime}, timeLeft: ''});
  gameUpdateFromAUWT([...liveGames, ...justStartedGames]);
});

export const cronJobForUpcomingGameUpdating = new CronJob(CYCLE_HOURLY, async () => {
  const currentTime = new Date().getTime();
  const upcomingGames = await Game.find({timeLeft: '', date: {$gt: currentTime}});
  gameUpdateFromAUWT(upcomingGames);
});
