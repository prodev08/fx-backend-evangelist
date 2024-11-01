import {queryField} from 'nexus';
import {User} from 'lib-mongoose';

export const MeQuery = queryField(t => {
  t.field('Me', {
    type: 'Me',
    resolve: async (source, args, context) => {
      const {uid} = context;
      return await User.findOne({uid}).exec();
    },
  });
});
