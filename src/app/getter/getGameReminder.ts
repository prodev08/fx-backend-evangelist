import {GameReminder} from 'lib-mongoose';

export default async function (gameID: string | null, uid: string | null | undefined) {
  const gameReminder = await GameReminder.findOne({
    gameID: gameID,
    uid: uid,
  }).exec();
  return gameReminder;
}
