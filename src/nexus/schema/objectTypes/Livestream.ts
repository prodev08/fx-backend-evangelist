import {objectType} from 'nexus';
import livestreamSourceIDExists from '../../../app/checker/livestreamSourceIDExists';

export const Livestream = objectType({
  name: 'Livestream',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('source');
    t.nonNull.string('link');
    t.nonNull.string('title');
    t.string('startDate');
    t.string('timezone');
    t.boolean('isLive');

    //dynamic
    t.field('LivestreamSource', {
      type: 'LivestreamSource',
      resolve: async ({source}) => {
        return await livestreamSourceIDExists(source);
      },
    });
  },
});
