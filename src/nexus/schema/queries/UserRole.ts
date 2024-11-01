import {nonNull, queryField, stringArg} from 'nexus';
import getRolesByLockerRoomID from '../../../app/getter/getRolesByLockerRoomID';

export const UserRoleQuery = queryField(t => {
  t.field('getUserRolesInLockerRoom', {
    type: 'UserRolesInLockerRoom',
    args: {
      lockerRoomID: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID}) => {
      return await getRolesByLockerRoomID(lockerRoomID!);
    },
  });
});
