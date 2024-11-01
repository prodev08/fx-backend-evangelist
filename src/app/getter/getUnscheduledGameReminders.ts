import {GameReminder} from 'lib-mongoose';

export default async function () {
  // Get Game reminders that do not have batch IDs
  const gameReminders = await GameReminder.find({
    emailBatchID: null,
  }).exec();

  return gameReminders;
}
