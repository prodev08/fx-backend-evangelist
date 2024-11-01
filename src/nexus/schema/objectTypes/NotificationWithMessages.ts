import {objectType} from 'nexus';

export const NotificationWithMessages = objectType({
  name: 'NotificationWithMessages',
  definition(t) {
    t.nonNull.field('Notification', {
      type: 'Notification',
    });
    t.nonNull.list.nonNull.field('Messages', {
      type: 'Message',
    });
  },
});
