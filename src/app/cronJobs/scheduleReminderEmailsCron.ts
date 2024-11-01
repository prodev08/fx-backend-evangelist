import {CronJob} from 'cron';
import {GameReminder, Logs} from 'lib-mongoose';
import gameIDExists from '../checker/gameIDExists';
import scheduleReminderEmail from '../email/helpers/scheduleReminderEmail';
import getUnscheduledGameReminders from '../getter/getUnscheduledGameReminders';

const CYCLE_DAILY = '0 0 * * *';

export const scheduleGameReminderEmails = async () => {
  try {
    // Get unscheduled game reminders
    const gameReminders = await getUnscheduledGameReminders();

    for (const reminder of gameReminders) {
      // Get game ID
      const game = await gameIDExists(reminder.gameID);

      const batch_id = await scheduleReminderEmail(reminder.uid, reminder.gameID, game);

      await GameReminder.findOneAndUpdate(
        {
          _id: reminder._id,
        },
        {$set: {emailBatchID: batch_id}}
      ).exec();

      await Logs.create({
        type: 'Scheduling reminder email',
        logs: `Scheduled ${reminder._id}`,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const cronForSchedulingGameReminders = new CronJob(CYCLE_DAILY, scheduleGameReminderEmails, null);
