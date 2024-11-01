import userIDExists from '../checker/userIDExists';
import channelSlugExists from '../checker/channelSlugExists';
import {getPhotoURL} from '../../nexus/schema';
import lockerRoomIDExists from '../checker/lockerRoomIDExists';
import removeAllHTML from '../transform/removeAllHTML';
import gameIDExists from '../checker/gameIDExists';

export default async function (
  actorUserID: string,
  channelSlug: string,
  type: string,
  text: string | null | undefined,
  Media?: {objectID: string; objectType: string}[] | null
) {
  const username = (await userIDExists(actorUserID)).username;
  const {name: channelName, lockerRoomID} = await channelSlugExists(channelSlug);
  const {name: lockerRoomName, slug: lockerRoomSlug} = await lockerRoomIDExists(lockerRoomID);
  const verb = type === 'Mention' ? 'mentioned you in' : 'replied to you in';
  let photoURL;
  if (Media) {
    photoURL = await getPhotoURL(Media[0].objectID, Media[0].objectType, false, '1024');
  }
  if (text) {
    text = removeAllHTML(text);
  }
  return {
    title: `${username} ${verb} ${channelName} in ${lockerRoomName}`,
    body: text,
    photoURL,
    redirect: `${process.env.BASE_URL}/locker-room/${lockerRoomSlug}/${channelSlug}`,
  };
}

export const createReminderPushNoficationTitleAndBody = async (gameID: string) => {
  const game = await gameIDExists(gameID);

  const title = 'FX1 Notification';
  const body = `Get ready to watch! ${game.team1DisplayName} V ${game.team2DisplayName} starts in 30 minutes.`;
  const redirect = `${process.env.BASE_URL}/${game.sport}/${game.leagueCode}/${game.team1DisplayName}-vs-${game.team2DisplayName}/${game.gameID}`;
  return {
    title,
    body,
    redirect,
    group: `Game:${gameID}`,
  };
};
