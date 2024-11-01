import {booleanArg, intArg, nonNull, queryField, stringArg} from 'nexus';
import {Message} from 'lib-mongoose';
import getMessagesByChannelSlug from '../../../app/getter/getMessagesByChannelSlug';
import getMessagesByChannelSlugCursorAsCreatedAtWithDirection from '../../../app/getter/getMessagesByChannelSlugCursorAsCreatedAtWithDirection';
import getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification from '../../../app/getter/getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification';

export const MessageQuery = queryField(t => {
  // t.field('getMessageWithNotificationType', {
  //   type: 'MessageWithNotificationType',
  //   args: {
  //     notificationId: nonNull(stringArg()),
  //   },
  //   resolve: async (source, {notificationId}) => {
  //     const {type, messageID} = await notificationIDExists(notificationId);
  //     const Message = await messageIDExists(messageID);
  //     return {
  //       type,
  //       Message,
  //     };
  //   },
  // });
  t.field('getMessage', {
    type: 'Message',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      return await Message.findById(id).exec();
    },
  });
  t.nonNull.field('getMessagesByChannelSlug', {
    type: 'Messages',
    args: {
      channelSlug: nonNull(stringArg()),
      count: intArg(),
      cursor: intArg(),
    },
    resolve: async (source, {channelSlug, count, cursor}) => {
      count ||= 10;
      cursor ||= 0;
      const items = await getMessagesByChannelSlug(channelSlug, count, cursor);
      const length = items.length;
      return {
        count: length,
        next: length + cursor,
        total: await Message.countDocuments({channelSlug}),
        items,
      };
    },
  });
  t.nonNull.field('getMessagesByChannelSlugUsingCreatedAtAsCursor', {
    type: 'MessagesNextAsString',
    args: {
      channelSlug: nonNull(stringArg()),
      count: intArg(),
      cursor: stringArg(),
      direction: nonNull(stringArg()),
    },
    resolve: async (source, {channelSlug, count, cursor, direction}) => {
      count ||= 10;
      const newCursor = !cursor ? 0 : parseInt(cursor);
      let items;
      let nextOptions;
      if (newCursor === 0) {
        items = await getMessagesByChannelSlug(channelSlug, count, newCursor);
        nextOptions = items[0];
      } else {
        if (direction === 'up') {
          items = (
            await Message.find({$and: [{channelSlug}, {createdAt: {$lte: newCursor}}]})
              .sort({createdAt: -1})
              .limit(count)
              .exec()
          ).reverse();
          nextOptions = items[0];
        } else {
          items = await Message.find({$and: [{channelSlug}, {createdAt: {$gte: newCursor}}]})
            .sort({createdAt: 1})
            .limit(count)
            .exec();
          nextOptions = items[items.length - 1];
        }
      }
      const next = nextOptions.createdAt.toString();
      const length = items.length;
      return {
        count: length,
        next,
        total: await Message.countDocuments({channelSlug}),
        items,
      };
    },
  });
  // enhanced - message with the indicated cursor will be hidden from view
  // t.nonNull.field('getMessagesByChannelSlugUsingCreatedAtAsCursor', {
  //   type: 'MessagesNextAsString',
  //   args: {
  //     channelSlug: nonNull(stringArg()),
  //     count: intArg(),
  //     cursor: stringArg(),
  //     direction: nonNull(stringArg()),
  //   },
  //   resolve: async (source, {channelSlug, count, cursor, direction}) => {
  //     count ||= 10;
  //     const newCursor = !cursor ? 0 : parseInt(cursor);
  //     let items;
  //     let nextOptions;
  //     if (newCursor === 0) {
  //       items = await getMessagesByChannelSlug(channelSlug, count, newCursor);
  //       nextOptions = items[0];
  //     } else {
  //       items = await getMessagesByChannelSlugCursorAsCreatedAtWithDirection(direction, channelSlug, count, newCursor);
  //       if (direction === 'up') {
  //         nextOptions = items[0];
  //       } else {
  //         nextOptions = items[items.length - 1];
  //       }
  //     }
  //     const next = items.length === 0 ? null : nextOptions.createdAt.toString();
  //     const length = items.length;
  //     return {
  //       count: length,
  //       next,
  //       total: await Message.countDocuments({channelSlug}),
  //       items,
  //     };
  //   },
  // });
  t.nonNull.field('getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification', {
    type: 'MessagesNextAsString',
    description:
      'API that will return the focused chat sandwiched between 1 message above if available and at least 1 message below',
    args: {
      channelSlug: nonNull(stringArg()),
      count: intArg(),
      cursor: stringArg(),
    },
    resolve: async (source, {channelSlug, count, cursor}) => {
      count ||= 10;
      const newCursor = !cursor ? 0 : parseInt(cursor);
      const items = await getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification(channelSlug, count, newCursor);
      const length = items.length;
      return {
        count: length,
        total: await Message.countDocuments({channelSlug}),
        items,
      };
    },
  });
  t.nonNull.field('getMessagesByChannelSlugUsingCreatedAtAsCursorV2', {
    type: 'MessagesNextAsString',
    description:
      'API that is a combination of getMessagesByChannelSlugUsingCreatedAtAsCursor (commented) and getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification',
    args: {
      channelSlug: nonNull(stringArg()),
      count: intArg(),
      cursor: stringArg(),
      direction: nonNull(stringArg()),
      withAdditional: nonNull(booleanArg()),
    },
    resolve: async (source, {channelSlug, count, cursor, direction, withAdditional}) => {
      count ||= 10;
      const newCursor = !cursor ? 0 : parseInt(cursor);
      let items;
      let nextOptions;
      if (withAdditional) {
        items = await getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification(channelSlug, count, newCursor);
      } else {
        if (newCursor === 0) {
          items = await getMessagesByChannelSlug(channelSlug, count, newCursor);
        } else {
          items = await getMessagesByChannelSlugCursorAsCreatedAtWithDirection(
            direction,
            channelSlug,
            count,
            newCursor
          );
        }
      }
      nextOptions = items[0];
      if (direction === 'down' && withAdditional === false) {
        nextOptions = items[items.length - 1];
      }
      const next = items.length === 0 || withAdditional ? null : nextOptions.createdAt.toString();
      const length = items.length;
      return {
        count: length,
        next,
        total: await Message.countDocuments({channelSlug}),
        items,
      };
    },
  });
});
