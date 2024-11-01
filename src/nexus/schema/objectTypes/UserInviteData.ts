import {objectType} from 'nexus';

export const UserInviteData = objectType({
  name: 'UserInviteData',
  definition(t) {
    t.string('group');
    t.string('role');
    t.string('lockerRoomID');
    t.string('emailAddress');
    t.string('lockerRoomSlug');
  },
});
