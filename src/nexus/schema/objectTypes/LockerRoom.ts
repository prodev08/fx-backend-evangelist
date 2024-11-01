import {objectType} from 'nexus';
import {ChannelGroup, UserRole, Sport, Club, League, FanGroup, InHouse, Game} from 'lib-mongoose';
import getRolesByLockerRoomID from '../../../app/getter/getRolesByLockerRoomID';
import getDefaultChannelSlug from '../../../app/getter/getDefaultChannelSlug';
import {channelGroupFilter} from '../../../utilities';
import getTotalUnreadMessagesCount from '../../../app/getter/getTotalUnreadMessagesCount';
import getIsSupported from '../../../app/getter/getIsSupported';

export const LockerRoom = objectType({
  name: 'LockerRoom',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('group');

    // dynamic
    t.string('defaultChannelSlug', {
      resolve: async ({id}) => {
        return await getDefaultChannelSlug(id!);
      },
    });
    t.int('totalUnreadMessagesCount', {
      resolve: async ({id}, args, {uid}) => {
        return (await getIsSupported(id!, uid)) ? (await getTotalUnreadMessagesCount(uid!, id!)) || 0 : 0;
      },
    });
    t.int('channelCount', {
      resolve: async ({id}, args, {loaders}) => {
        return (await loaders?.findGroupAggregateByGroup.load(`LockerRoom:${id}`))?.channels || 0;
        // return (await GroupAggregates.findOne({group: `LockerRoom:${id}`}).exec())?.channels || 0;
      },
    });
    t.int('supporterCount', {
      resolve: async ({id}, args, {loaders}) => {
        return (await loaders?.findGroupAggregateByGroup.load(`LockerRoom:${id}`))?.supporters || 0;
        // return (await GroupAggregates.findOne({group: `LockerRoom:${id}`}).exec())?.supporters || 0;
      },
    });
    t.boolean('isSupported', {
      resolve: async ({id}, args, {uid}) => {
        return ((await UserRole.find({lockerRoomID: id, uid})) || []).length > 0;
      },
    });
    t.field('MyRole', {
      description: 'Return role if either owner or manager else null',
      type: 'UserRole',
      resolve: async ({id}, args, {uid}) => {
        return (
          (await UserRole.findOne({
            $and: [{lockerRoomID: id, uid}, {$or: [{role: 'owner'}, {role: 'manager'}]}],
          }).exec()) || null
        );
      },
    });
    t.list.field('Sports', {
      type: 'Sport',
      resolve: async ({group}) => {
        const [objectType, objectID] = group.split(':');
        if (objectType === 'Club') {
          const sportIDs = (await Club.findById(objectID).exec())!.sportIDs!;
          return await Sport.find({_id: {$in: sportIDs}}).exec();
        }
        if (objectType === 'League') {
          const sportIDs = (await League.findById(objectID).exec())!.sportIDs!;
          return await Sport.find({_id: {$in: sportIDs}}).exec();
        }
        if (objectType === 'FanGroup') {
          const sportIDs = (await FanGroup.findById(objectID).exec())!.sportIDs!;
          return await Sport.find({_id: {$in: sportIDs}}).exec();
        }
        if (objectType === 'InHouse') {
          const sportIDs = (await InHouse.findById(objectID).exec())!.sportIDs!;
          return await Sport.find({_id: {$in: sportIDs}}).exec();
        }
        if (objectType === 'Game') {
          const sportName = (await Game.findOne({gameID: objectID}).exec())!.sport;
          const sport = await Sport.find({name: sportName}).exec();
          return sport;
        }
        return null;
      },
    });
    t.nonNull.list.nonNull.string('sportsIDs', {
      resolve: async ({group}, args, {loaders}) => {
        const [objectType, objectID] = group.split(':');
        if (objectType === 'Club') {
          return (await loaders?.findClubByID.load(objectID!))!.sportIDs!;
        }
        if (objectType === 'League') {
          return (await loaders?.findLeagueByID.load(objectID!))!.sportIDs!;
        }
        if (objectType === 'FanGroup') {
          return (await loaders?.findFanGroupByID.load(objectID!))!.sportIDs!;
        }
        return [];
      },
    });
    t.field('Club', {
      type: 'Club',
      resolve: async ({group}, args, {loaders}) => {
        const [objectType, objectID] = group.split(':');
        return objectType === 'Club' && group.startsWith('Club')
          ? (await loaders?.findClubByID.load(objectID!)) || null
          : null;
      },
    });
    t.field('League', {
      type: 'League',
      resolve: async ({group}, args, {loaders}) => {
        const [objectType, objectID] = group.split(':');
        return objectType === 'League' && group.startsWith('League')
          ? (await loaders?.findLeagueByID.load(objectID!)) || null
          : null;
      },
    });
    t.field('FanGroup', {
      type: 'FanGroup',
      resolve: async ({group}, args, {loaders}) => {
        const [objectType, objectID] = group.split(':');
        return objectType === 'FanGroup' && group.startsWith('FanGroup')
          ? (await loaders?.findFanGroupByID.load(objectID!)) || null
          : null;
      },
    });
    t.field('InHouse', {
      type: 'InHouse',
      resolve: async ({group}, args, {loaders}) => {
        const [objectType, objectID] = group.split(':');
        return objectType === 'InHouse' && group.startsWith('InHouse')
          ? (await loaders?.findInHouseByID.load(objectID!)) || null
          : null;
      },
    });
    t.field('Game', {
      type: 'Game',
      resolve: async ({group}) => {
        const [objectType, objectID] = group.split(':');
        return objectType === 'Game' && group.startsWith('Game')
          ? (await Game.findOne({gameID: objectID})) || null
          : null;
      },
    });
    t.list.field('ChannelGroups', {
      type: 'ChannelGroup',
      resolve: async ({id}) => {
        return await ChannelGroup.aggregate([
          {$match: {...channelGroupFilter, lockerRoomID: id}},
          {
            $addFields: {
              rank: {
                $cond: {
                  if: {$eq: ['$withLivestream', false]},
                  then: 0,
                  else: 1,
                },
              },
              id: {$toString: '$_id'},
            },
          },
          {
            $sort: {rank: -1},
          },
        ]);
      },
    });
    t.field('Roles', {
      type: 'UserRolesInLockerRoom',
      resolve: async ({id: lockerRoomID}) => {
        return await getRolesByLockerRoomID(lockerRoomID!);
      },
    });
  },
});

export const UserRolesInLockerRoom = objectType({
  name: 'UserRolesInLockerRoom',
  definition(t) {
    // dynamic
    t.nonNull.list.nonNull.field('Owners', {type: 'UserRole'});
    t.nonNull.list.nonNull.field('Managers', {type: 'UserRole'});
    t.nonNull.list.nonNull.field('Supporters', {type: 'UserRole'});
  },
});

// export const LockerRoomTypes = objectType({
//   name: 'LockerRoomTypes',
//   definition(t) {
//     // dynamic
//     t.nonNull.list.nonNull.field('Leagues', {type: 'League'});
//     t.nonNull.list.nonNull.field('Clubs', {type: 'Club'});
//     t.nonNull.list.nonNull.field('FanGroups', {type: 'FanGroup'});
//   },
// });
