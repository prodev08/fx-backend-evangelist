import {objectType} from 'nexus';

export const League = objectType({
  name: 'League',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.list.nonNull.string('sportIDs');
    t.field('Avatar', {type: 'Media'});
    t.field('CoverPhoto', {type: 'Media'});
    t.float('boost');
  },
});
