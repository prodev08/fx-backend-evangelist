import {nonNull, queryField, stringArg} from 'nexus';
import getUnreadMessagesCount from '../../../app/getter/getUnreadMessagesCount';
import getChannelSlugs from '../../../app/getter/getChannelSlugs';

export const ReadMessageQuery = queryField(t => {
  t.list.field('getUnreadMessages', {
    type: 'ReadMessage',
    args: {
      lockerRoomID: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID}, context) => {
      const {uid} = context;
      if (!uid) {
        return null;
      }
      const channelSlugs = await getChannelSlugs(lockerRoomID);
      return Promise.all(
        channelSlugs.map(async (channelSlug: string) => {
          const items = await getUnreadMessagesCount(uid, channelSlug);
          return {
            channelSlug: channelSlug,
            unreadMessagesCount: items,
          };
        })
      );
    },
  });
});
