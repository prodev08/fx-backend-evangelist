import {objectType} from 'nexus';

export const GamePartner = objectType({
  name: 'GamePartner',
  definition(t) {
    t.id('id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.field('Icon', {type: 'Media'});
    t.field('Logo', {type: 'Media'});
    t.boolean('isHidden');
  },
});
