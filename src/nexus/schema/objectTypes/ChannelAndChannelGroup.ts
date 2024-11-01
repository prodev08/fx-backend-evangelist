import {objectType} from 'nexus';
import {Channel, ChannelGroup} from 'lib-mongoose';

export const ChannelAndChannelGroup = objectType({
  name: 'ChannelAndChannelGroup',
  definition(t) {
    // dynamic
    t.list.field('Channels', {
      type: 'Channel',
      resolve: async () => {
        return await Channel.find({isDeleted: true}).exec();
      },
    });
    t.list.field('ChannelGroups', {
      type: 'ChannelGroup',
      resolve: async () => {
        return await ChannelGroup.find({isDeleted: true}).exec();
      },
    });
  },
});
