import {UserInputError} from 'apollo-server-express';
import {MutationResult} from 'lib-api-common';
import {IAppResolverContext} from 'lib-api-common/build/interfaces';
import {GameReminder} from 'lib-mongoose';
import {mutationField, nonNull, stringArg} from 'nexus';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import gameIDExists from '../../../app/checker/gameIDExists';
import cancelBatchID from '../../../app/email/helpers/cancelBatchID';
import scheduleReminderEmail from '../../../app/email/helpers/scheduleReminderEmail';
import getGameReminder from '../../../app/getter/getGameReminder';
import {sendReminderPushNotification} from '../../../app/fcmNotification/pushNotification';

/*
    GameReminder Mutations
    Pre-requisite:
    1. Require a logged in user.
    2. Require a user account.

    Checks:
    1. Verify if user is logged in
    2. Check if user has a valid account
    3. Check if game exists related to the ID

    Creation/Deletion:
    a. Check if game reminder already exists
    b. Only schedule an email if the game is within 24 hours
    c. If game reminder does not exist do not process delete
    d. Cancel the scheduled email if exists
*/

async function implementation(type: string, gameID: string | null, context: IAppResolverContext) {
  const {uid} = context;
  // 1. Require a logged in user.
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);

  const userID = customClaims.app.userID;

  // 2. Verify if inputted gameID exists else throw an error.
  const game = await gameIDExists(gameID!);

  //a. Check if reminder exists and get the document
  const gameReminder = await getGameReminder(gameID, uid);

  if (type === 'create') {
    if (gameReminder) {
      throw new UserInputError(`Game reminder already exists. Input: ${gameID}`);
    }

    let batch_id;
    if (uid && gameID) {
      batch_id = await scheduleReminderEmail(uid, gameID, game);
    }

    // 3.1 Create the GameReminder doc, if not successful, expect an error.
    const result = await GameReminder.findOneAndUpdate(
      {
        gameID: gameID,
        uid: uid,
        userID: userID,
        scheduledTime: game.date - 1800000, // 1800000 is milliseconds of 30 minutes.
        emailBatchID: batch_id,
      },
      {},
      {upsert: true, new: true}
    ).exec();

    return result?.id;
  } else if (type === 'delete') {
    //c. If gamereminder does not exist do not process delete, expect an error
    if (!gameReminder) {
      throw new UserInputError(`Game Reminder does not exist. Input: ${gameID}`);
    }

    //d. Cancel the scheduled email if exists.
    if (gameReminder.emailBatchID) {
      const response = await cancelBatchID(gameReminder.emailBatchID);
      console.log(response);
    }

    // 3.2 Delete the GameReminder doc, if not successful, expect an error.
    const result = await GameReminder.findOneAndDelete({
      gameID: gameID,
      uid: uid,
      userID: userID,
    }).exec();

    return result?.id;
  }
  return null;
}

export const GameReminderMutations = mutationField(t => {
  t.nonNull.field('setGameReminder', {
    type: 'MutationResult',
    args: {
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {gameID}, context) => {
      const result = await implementation('create', gameID, context);
      return new MutationResult('GameReminder', result);
    },
  });

  t.nonNull.field('unsetGameReminder', {
    type: 'MutationResult',
    args: {
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {gameID}, context) => {
      const result = await implementation('delete', gameID, context);
      return new MutationResult('GameReminder', result);
    },
  });

  t.field('testReminderPushNotification', {
    type: 'MutationResult',
    args: {
      userID: nonNull(stringArg()),
    },
    resolve: async (source, {userID}) => {
      const result = await sendReminderPushNotification(userID, {gameID: '531227'});
      return new MutationResult('GameReminder', result);
    },
  });
});
