import {queryField} from 'nexus';

export const ChannelAndChannelGroupQuery = queryField(t => {
  t.field('getDeletedChannelAndChannelGroups', {
    type: 'ChannelAndChannelGroup',
    resolve: async () => {
      return {};
    },
  });
});
