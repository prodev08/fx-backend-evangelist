import {queryField, stringArg} from 'nexus';
import {FanGroup} from 'lib-mongoose';
import {fanGroupFilter} from '../../../utilities';
import stringToObjectId from '../../../app/transform/stringToObjectId';

export const FanGroupQuery = queryField(t => {
  t.field('getFanGroup', {
    type: 'FanGroup',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        const _id = stringToObjectId(id);
        return await FanGroup.findOne({...fanGroupFilter, _id}).exec();
      }
      if (slug) {
        return await FanGroup.findOne({...fanGroupFilter, slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getFanGroups', {
    type: 'FanGroups',
    resolve: async () => {
      const items = await FanGroup.find(fanGroupFilter).exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
