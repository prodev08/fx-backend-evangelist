import {CronJob} from 'cron';
import {GameReminder} from 'lib-mongoose';

import {gameReminderFilter} from '../../utilities';
import {CYCLE_MINUTE} from './utils';
import {sendReminderPushNotification} from '../fcmNotification/pushNotification';

export const cronJobForRemindPushNotification = new CronJob(CYCLE_MINUTE(2), async () => {
  const currentTime = new Date().getTime();
  const reminders = await GameReminder.find({...gameReminderFilter, scheduledTime: {$lt: currentTime}});
  reminders.forEach(async reminder => {
    await sendReminderPushNotification(reminder.userID, {gameID: reminder.gameID.toString()});
    await reminder.updateOne({reminderSent: true});
  });
});
