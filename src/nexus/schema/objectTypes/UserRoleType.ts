import {objectType} from 'nexus';

export const UserRoleType = objectType({
  name: 'UserRoleType',
  definition(t) {
    t.id('id');
    t.nonNull.string('name');
  },
});
