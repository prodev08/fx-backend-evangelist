import {booleanArg, intArg, nonNull, queryField, stringArg} from 'nexus';
import {Message, Notification} from 'lib-mongoose';
import notificationIDExists from '../../../app/checker/notificationIDExists';
import messageIDExists from '../../../app/checker/messageIDExists';

export const NotificationQuery = queryField(t => {
  t.field('getNotifications', {
    type: 'Notifications',
    args: {
      isRead: booleanArg(),
      count: intArg(),
      cursor: intArg(),
    },
    resolve: async (source, {isRead, count, cursor}, context) => {
      count ||= 10;
      cursor ||= 0;
      let filter;
      const {uid} = context;
      if (!uid) {
        return null;
      }
      if (isRead === true || isRead === false) {
        filter = {targetUid: uid, isRead};
      } else {
        filter = {targetUid: uid};
      }
      const items = await Notification.find(filter).sort({createdAt: -1}).skip(cursor).limit(count).exec();
      const length = items.length;
      return {
        count: length,
        next: length + cursor,
        total: await Notification.countDocuments(filter),
        items,
      };
    },
  });
  t.field('getNotification', {
    type: 'Notification',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      return await notificationIDExists(id);
    },
  });
  t.field('getNotificationWithMessages', {
    type: 'NotificationWithMessages',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const notification = await notificationIDExists(id);
      if (notification.type === 'Mention') {
        return {
          Notification: notification!,
          Messages: [await messageIDExists(notification.messageID)],
        };
      }
      const repliedMessage = await messageIDExists(notification.messageID);
      const originalChatID = repliedMessage.repliedToChatID;
      const replyToOriginalChatID = notification.chatID;
      // console.log('replyToOriginalChatID', replyToOriginalChatID);
      // const timestamp = notification.createdAt;
      const ReplyToReplyMessages = await Message.find({
        repliedToChatID: replyToOriginalChatID,
      });
      // console.log('ReplyToReplyChatID', ReplyToReplyChatID);
      const originalMessage = (await Message.findOne({
        chatID: originalChatID,
      }).exec())!;
      // const repliedMessage = await messageIDExists(notification.messageID);
      // const originalMessageChatID = repliedMessage.repliedToChatID;
      // const originalNotification = await Notification.findOne({chatID: repliedMessage.chatID, type: 'Reply'}).exec();
      return {
        Notification: notification!,
        Messages: [originalMessage, repliedMessage].concat(ReplyToReplyMessages),
      };
    },
  });
});
