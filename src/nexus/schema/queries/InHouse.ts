import {queryField, stringArg} from 'nexus';
import {InHouse} from 'lib-mongoose';

export const InHouseQuery = queryField(t => {
  t.field('getInHouse', {
    type: 'InHouse',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await InHouse.findById(id).exec();
      }
      if (slug) {
        return await InHouse.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getInHouses', {
    type: 'InHouses',
    resolve: async () => {
      const items = await InHouse.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
