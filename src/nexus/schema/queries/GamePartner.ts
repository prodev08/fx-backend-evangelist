import {queryField} from 'nexus';
import {GamePartner, Game, GamePartnerDocument} from 'lib-mongoose';
import {gamePartnerFilter} from '../../../utilities';

export const GamePartnerQuery = queryField(t => {
  t.nonNull.field('getGamePartners', {
    type: 'GamePartners',
    resolve: async () => {
      const items = await GamePartner.find(gamePartnerFilter).exec();
      const availableItems: GamePartnerDocument[] = [];
      for (const item of items) {
        const count = await Game.find({'links.source': item.name}).count();
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
