import {list, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import {Notification} from 'lib-mongoose';
import notificationIDExists from '../../../app/checker/notificationIDExists';

export const NotificationMutations = mutationField(t => {
  t.nonNull.field('readNotification', {
    type: 'MutationResult',
    args: {
      notificationIDs: nonNull(list(nonNull(stringArg()))),
    },
    resolve: async (source, {notificationIDs}, context) => {
      const {uid: targetUid} = context;
      const _ids = notificationIDs.map((item: string) => stringToObjectId(item));
      await Notification.updateMany({targetUid, _id: {$in: _ids}}, {isRead: true});
      return new MutationResult('Notification', null);
    },
  });
  t.nonNull.field('seenNotification', {
    type: 'MutationResult',
    args: {
      lastNotificationID: nonNull(stringArg()),
    },
    resolve: async (source, {lastNotificationID}, context) => {
      const {uid: targetUid} = context;
      const createdAt = (await notificationIDExists(lastNotificationID)).createdAt;
      await Notification.updateMany({createdAt: {$lte: createdAt}, targetUid}, {isSeen: true});
      return new MutationResult('Notification', null);
    },
  });
});
