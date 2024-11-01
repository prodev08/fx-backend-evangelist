import {
  cronJobForGameUpdatingDaily,
  cronJobForLiveGameUpdating,
  cronJobForUpcomingGameUpdating,
} from './gameUpdatingJobs';
import {cronJobForRemindPushNotification} from './remindPushNotification';
import {cronForSchedulingGameReminders} from './scheduleReminderEmailsCron';

export default () => {
  console.log('cronJobs started!');
  cronJobForRemindPushNotification.start();
  cronJobForGameUpdatingDaily.start();
  cronJobForLiveGameUpdating.start();
  cronJobForUpcomingGameUpdating.start();
  cronForSchedulingGameReminders.start();
};
