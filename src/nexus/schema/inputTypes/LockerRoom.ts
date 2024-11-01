import {inputObjectType} from 'nexus';

export const InputInviteUserForManagerialRole = inputObjectType({
  name: 'InputInviteUserForManagerialRole',
  definition(t) {
    t.string('emailAddress');
    t.string('role');
  },
});

export const InputUpdateLockerRoomUserRoles = inputObjectType({
  name: 'InputUpdateLockerRoomUserRoles',
  definition(t) {
    t.nonNull.string('type');
    t.nonNull.string('userID');
    t.string('role');
  },
});
