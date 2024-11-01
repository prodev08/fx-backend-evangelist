import {queryField, list} from 'nexus';
import {GameReminder} from 'lib-mongoose';
import {gameReminderFilter} from '../../../utilities';

export const GameReminderQuery = queryField(t => {
  t.nonNull.field('getGameRemindersForCloudFunction', {
    type: list('GameReminder'),
    resolve: async () => {
      const items = await GameReminder.find(gameReminderFilter).find({scheduledTime: {$lt: new Date().getTime()}});
      items.forEach(async item => {
        item.reminderSent = true;
        await item.save();
      });
      return items;
    },
  });
});
