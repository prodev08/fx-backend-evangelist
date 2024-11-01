import {queryField, stringArg} from 'nexus';
import {Sport, Game, SportDocument} from 'lib-mongoose';
import {sportFilter} from '../../../utilities';

export const SportQuery = queryField(t => {
  t.field('getSport', {
    type: 'Sport',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}, {loaders}) => {
      if (id) {
        return (await loaders?.findSportByID.load(id)) || null;
      }
      if (slug) {
        return (await loaders?.findSportBySlug.load(slug)) || null;
      }
      return null;
    },
  });
  // All isHidden sports will not be shown here that includes other sports currently added in the new explore page only
  t.nonNull.field('getSports', {
    description: 'This is for the OG querying of sport and currently used in the landing page and OG locker rooms',
    type: 'Sports',
    resolve: async () => {
      const items = await Sport.find(sportFilter).exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
  t.nonNull.field('getSportsWithIcon', {
    description: 'This is for the new explore page. Should be use to show the sports that has an Icon.',
    type: 'Sports',
    resolve: async () => {
      const items = await Sport.find({Icon: {$ne: null}}).exec();
      const availableItems: SportDocument[] = [];
      for (const item of items) {
        const count = await Game.find({sport: item.name}).count();
        if (count > 0) availableItems.push(item);
      }
      return {
        count: availableItems.length,
        total: availableItems.length,
        items: availableItems,
      };
    },
  });
});
