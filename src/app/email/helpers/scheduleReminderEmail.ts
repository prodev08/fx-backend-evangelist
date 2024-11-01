import {UserInputError} from 'apollo-server-express';
import {GameModel} from 'lib-mongoose';
import getUser from '../../getter/getUser';
import sendTemplatedEmail, {defaultSender} from '../sendTemplatedEmail';
import generateBatchID from './generateBatchID';

export default async function (uid: string, gameID: string, game: GameModel): Promise<string | null> {
  const user = await getUser(uid);

  // Calculate the number of hours to the game
  const diff = game.date - new Date().getTime();

  if (diff < 0) {
    throw new UserInputError(`Game has already occured. Input: ${gameID}`);
  }
  // Convert milliseconds into hours
  const hours = Math.floor(diff / (1000 * 60 * 60));

  let batch_id;
  //b. Only schedule an email if hours left to the game are less than 24
  if (hours <= 24) {
    // Create a batch ID to be tracked later when deleting
    const data = await generateBatchID();

    if (!data) {
      throw new Error('Failed to create a batch ID. Please try again later');
    }

    batch_id = data.batch_id;

    if (user) {
      // Creating an eventroom_link
      let eventroomLink = '';
      if (global.appEnv === 'develop') {
        eventroomLink = 'dev.fx1.io';
      } else if (global.appEnv === 'staging') {
        eventroomLink = 'staging.fx1.io';
      } else {
        eventroomLink = 'fx1.io';
      }
      eventroomLink += `/${game.sport}/${game.leagueCode}/${game.team1DisplayName}-vs-${game.team2DisplayName}/${game.gameID}`;
      eventroomLink = eventroomLink.replace(/\s+/g, '-').toLowerCase();

      // Schedule an email to be sent via sendgrid
      sendTemplatedEmail('gameReminder', {
        subject: 'FX1 Sports game reminder',
        recipients: [user?.emailAddress],
        data: {
          username: user?.username,
          'home-team': game.team1DisplayName,
          'away-team': game.team2DisplayName,
          eventroom_link: eventroomLink,
        },
        sender: defaultSender,
        sendAt: Math.round(game?.date / 1000 - 1800),
        batchID: batch_id,
      });
    }

    return batch_id;
  } else {
    return null;
  }
}
