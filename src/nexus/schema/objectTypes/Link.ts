import {objectType} from 'nexus';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.string('source');
    t.string('type');
    t.string('url');
    t.string('iconUrl');
    t.string('logoUrl');
    t.string('avatarUrl');
  },
});
