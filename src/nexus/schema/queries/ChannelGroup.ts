import {nonNull, queryField, stringArg} from 'nexus';
import {ChannelGroup} from 'lib-mongoose';
import {channelGroupFilter} from '../../../utilities';
import stringToObjectId from '../../../app/transform/stringToObjectId';

export const ChannelGroupQuery = queryField(t => {
  t.field('getChannelGroup', {
    type: 'ChannelGroup',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        const channelGroupID = stringToObjectId(id);
        return await ChannelGroup.findOne({...channelGroupFilter, _id: channelGroupID}).exec();
      }
      if (slug) {
        return await ChannelGroup.findOne({...channelGroupFilter, slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getChannelGroups', {
    type: 'ChannelGroups',
    resolve: async () => {
      const items = await ChannelGroup.find(channelGroupFilter).exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
  t.boolean('channelGroupExists', {
    args: {
      name: nonNull(stringArg()),
      lockerRoomID: nonNull(stringArg()),
    },
    resolve: async (source, {name, lockerRoomID}) => {
      const items = await ChannelGroup.findOne({...channelGroupFilter, name, lockerRoomID}).exec();
      return !!items;
    },
  });
});
