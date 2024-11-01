import {objectType} from 'nexus';
import {UserInvites} from 'lib-mongoose';

export const UserInvite = objectType({
  name: 'UserInvite',
  definition(t) {
    t.id('id');
    t.float('time');
    t.nonNull.string('type');
    t.nonNull.string('userID');
    t.nonNull.string('group');
    t.string('url');
    t.float('expiration');

    // dynamic
    t.field('data', {
      type: 'UserInviteData',
      resolve: async ({id}) => {
        const result = await UserInvites.findById(id).exec();
        const {group, role, lockerRoomID, emailAddress, lockerRoomSlug} = result?.data;
        return {
          group,
          role,
          lockerRoomID,
          emailAddress,
          lockerRoomSlug,
        };
      },
    });
  },
});
