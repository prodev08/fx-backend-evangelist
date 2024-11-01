import {objectType} from 'nexus';

export const LivestreamSource = objectType({
  name: 'LivestreamSource',
  definition(t) {
    t.id('id');
    t.nonNull.string('name');
  },
});
