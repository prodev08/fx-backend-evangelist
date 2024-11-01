import {objectType} from 'nexus';

export const FanGroup = objectType({
  name: 'FanGroup',
  definition(t) {
    // schema
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.list.nonNull.string('sportIDs');
    t.field('Avatar', {type: 'Media'});
    t.field('CoverPhoto', {type: 'Media'});
    t.boolean('isDeleted');
  },
});
