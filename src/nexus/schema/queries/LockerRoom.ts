import {intArg, nonNull, queryField, stringArg} from 'nexus';
import {
  Club,
  ClubDocument,
  FanGroup,
  FanGroupDocument,
  League,
  LeagueDocument,
  LockerRoom,
  User,
  UserRole,
  UserInvites,
} from 'lib-mongoose';
import userInviteIDExists from '../../../app/checker/userInviteIDExists';
import getSupportedLockerRooms from '../../../app/getter/getSupportedLockerRooms';
import {fanGroupFilter, userFilter} from '../../../utilities';
import channelIDExists from '../../../app/checker/channelIDExists';

export const LockerRoomQuery = queryField(t => {
  t.field('getLockerRoom', {
    type: 'LockerRoom',
    args: {
      id: stringArg(),
      slug: stringArg(),
      group: stringArg(),
    },
    resolve: async (source, {id, slug, group}) => {
      if (id) {
        return await LockerRoom.findById(id).exec();
      }
      if (slug) {
        return await LockerRoom.findOne({slug}).exec();
      }
      if (group) {
        return await LockerRoom.findOne({group}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getLockerRooms', {
    type: 'LockerRooms',
    resolve: async () => {
      const items = await LockerRoom.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
  t.boolean('invitedUserExists', {
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      // Note: This will be used prior to running respondUserManagerialRoleInvite API
      await userInviteIDExists(id);
      const emailAddress = (await UserInvites.findById(id, {'data.emailAddress': 1}).exec())!.data.emailAddress;
      const exists = await User.findOne({emailAddress, ...userFilter}).exec();
      return !!exists;
    },
  });
  t.list.field('Supporting', {
    type: 'LockerRoom',
    resolve: async (source, args, {uid}) => {
      return uid ? await getSupportedLockerRooms(uid) : [];
    },
  });
  t.nonNull.list.nonNull.field('getFeatured', {
    type: 'LockerRoom',
    resolve: async () => {
      const clubs = (await Club.find({isFeatured: true}).exec()).map((item: ClubDocument) => `Club:${item.id}`);
      const leagues = (await League.find({isFeatured: true}).exec()).map((item: LeagueDocument) => `League:${item.id}`);
      const fanGroups = (await FanGroup.find({...fanGroupFilter, isFeatured: true}).exec()).map(
        (item: FanGroupDocument) => `FanGroup:${item.id}`
      );
      const groups = clubs.concat(leagues).concat(fanGroups);
      return await LockerRoom.find({group: {$in: groups}})
        .sort({name: 1})
        .exec();
    },
  });
  t.nonNull.field('getAvailableUsersForPrivateChannel', {
    type: 'Users',
    args: {
      channelID: nonNull(stringArg()),
      next: stringArg(),
      count: intArg(),
      name: stringArg(),
    },
    resolve: async (source, {channelID, next, count, name}) => {
      const defaultCount = 10;
      // 1. Verify if the channelID exists else throw an error.
      await channelIDExists(channelID);
      // 2. Get Private Group users.
      const privateGroupUsers = await UserRole.find({group: `Channel:${channelID}`});
      const ids = privateGroupUsers.map(ele => ele.userID);
      // 3. Get available users.
      let query = User.find({_id: {$nin: ids}});
      if (name) query = query.find({username: {$regex: new RegExp(name, 'i')}});
      if (next) query = query.find({_id: {$gt: next}});
      const availableUsers = await query.limit(count || defaultCount).exec();
      return {
        count: availableUsers.length,
        items: availableUsers,
        next: availableUsers.length > 0 ? availableUsers[availableUsers.length - 1].id : null,
      };
    },
  });
});
