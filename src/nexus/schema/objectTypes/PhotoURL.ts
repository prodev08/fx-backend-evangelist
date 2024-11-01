import {objectType} from 'nexus';

export const PhotoURL = objectType({
  name: 'PhotoURL',
  definition(t) {
    t.nonNull.string('type');
    t.string('photoURL');
  },
});
