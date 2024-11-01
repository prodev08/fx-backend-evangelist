import {objectType} from 'nexus';

export const ZipCode = objectType({
  name: 'ZipCode',
  definition(t) {
    t.nonNull.string('zip');
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('country');
  },
});
