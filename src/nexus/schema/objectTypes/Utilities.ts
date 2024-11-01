import {objectType} from 'nexus';

export const Utilities = objectType({
  name: 'Utilities',
  definition(t) {
    t.field('Utilities', {type: 'JSON'});
  },
});
