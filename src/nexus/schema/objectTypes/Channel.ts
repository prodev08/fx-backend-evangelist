import {objectType} from 'nexus';
import getUnreadMessagesCount from '../../../app/getter/getUnreadMessagesCount';
import getIsSupported from '../../../app/getter/getIsSupported';
import getLockerRoomIDViaChannelGroupID from '../../../app/getter/getLockerRoomIDViaChannelGroupID';
import livestreamIDExists from '../../../app/checker/livestreamIDExists';
import {getRolesByPrivateChannelID} from '../../../app/getter/getRolesByLockerRoomID';

export const Channel = objectType({
  name: 'Channel',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.nonNull.string('channelGroupID');
    t.nonNull.string('type');
    t.boolean('isDeleted');
    t.nonNull.string('lockerRoomID');
    t.string('livestreamID');

    // dynamic
    t.float('unreadMessagesCount', {
      resolve: async ({slug, channelGroupID}, args, {uid}) => {
        const id = await getLockerRoomIDViaChannelGroupID(channelGroupID);
        return (await getIsSupported(id!, uid)) ? (await getUnreadMessagesCount(uid!, slug)) || 0 : 0;
      },
    });
    t.field('Livestream', {
      type: 'Livestream',
      resolve: async ({livestreamID}) => {
        if (!livestreamID) {
          return null;
        }
        return await livestreamIDExists(livestreamID);
      },
    });
    t.field('Roles', {
      type: 'UserRolesInPrivateChannel',
      resolve: async ({id}) => {
        return await getRolesByPrivateChannelID(id!);
      },
    });
  },
});

export const UserRolesInPrivateChannel = objectType({
  name: 'UserRolesInPrivateChannel',
  definition(t) {
    // dynamic
    t.nonNull.list.nonNull.field('Owners', {type: 'UserRole'});
    t.nonNull.list.nonNull.field('Joiners', {type: 'UserRole'});
  },
});
