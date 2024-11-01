import {objectType} from 'nexus';

export const ReadMessage = objectType({
  name: 'ReadMessage',
  definition(t) {
    t.nonNull.string('channelSlug');
    t.float('unreadMessagesCount');
  },
});
