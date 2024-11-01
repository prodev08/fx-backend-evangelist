import {objectType} from 'nexus';

export const GameReminder = objectType({
  name: 'GameReminder',
  definition(t) {
    //schema
    t.nonNull.string('uid');
    t.nonNull.string('userID');
    t.nonNull.string('gameID');
    t.boolean('reminderSent');
    t.float('createdAt');
    t.float('updatedAt'); // Updated when a reminder is sent
    t.float('scheduledTime');
    t.string('emailBatchID');
  },
});
