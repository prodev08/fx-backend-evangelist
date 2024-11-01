import {objectType} from 'nexus';
import {User, UserRoleType} from 'lib-mongoose';

export const UserRole = objectType({
  name: 'UserRole',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('group');
    t.nonNull.string('groupType');
    t.nonNull.string('groupID');
    t.nonNull.string('userID');
    t.nonNull.string('uid');
    t.nonNull.string('role');
    t.nonNull.string('status');
    t.nonNull.string('lockerRoomID');
    t.boolean('isPrimaryOwner');

    // dynamic
    t.nonNull.field('User', {
      type: 'User',
      resolve: async ({uid}) => {
        return (await User.findOne({uid}).exec())!;
      },
    });
    t.list.nonNull.field('UserRoleType', {
      type: 'UserRoleType',
      resolve: async ({role}) => {
        return await UserRoleType.find({_id: role!}).exec();
      },
    });
  },
});
