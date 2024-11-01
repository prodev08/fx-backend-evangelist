import {queryField} from 'nexus';
import {Utilities, UtilitiesDocument} from 'lib-mongoose';

export const UtilitiesQuery = queryField(t => {
  t.field('getUtilities', {
    type: 'Utilities',
    resolve: async () => {
      const result: any = {};
      (await Utilities.find({}).exec()).map((item: UtilitiesDocument) => {
        result[item.key] = item.value;
      });
      return {Utilities: result};
    },
  });
});
