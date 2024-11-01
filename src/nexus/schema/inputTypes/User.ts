import {inputObjectType} from 'nexus';

export const InputUser = inputObjectType({
  name: 'InputUser',
  definition(t) {
    t.string('username');
    t.string('firstName');
    t.string('lastName');
    t.field('Avatar', {type: 'InputMedia'});
  },
});

export const InputEditUser = inputObjectType({
  name: 'InputEditUser',
  definition(t) {
    t.field('Avatar', {type: 'InputMedia'});
  },
});
