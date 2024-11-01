import {intArg, objectType} from 'nexus';
import {
  Club,
  ClubDocument,
  League,
  LeagueDocument,
  LockerRoom,
  FanGroup,
  FanGroupDocument,
  Utilities,
} from 'lib-mongoose';
import {fanGroupFilter} from '../../../utilities';

export const Sport = objectType({
  name: 'Sport',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('status');
    t.nonNull.field('Avatar', {
      type: 'Media',
    });
    t.nonNull.field('CoverPhoto', {type: 'Media'});
    t.field('Icon', {type: 'Media'});

    // dynamic
    t.nonNull.field('LockerRooms', {
      type: 'LockerRooms',
      args: {
        count: intArg(),
        cursor: intArg(),
      },
      resolve: async ({id}, {count, cursor}) => {
        count ||= 100;
        cursor ||= 0;
        const leagues = (await League.find({sportIDs: {$in: id}}).exec()).map(
          (item: LeagueDocument) => `League:${item.id}`
        );
        const showLockerRoomClubs = (await Utilities.findOne({key: 'showLockerRoomClubs'}).exec())?.value;
        const shouldShowLockerRoomClubs = showLockerRoomClubs === undefined ? true : showLockerRoomClubs;
        const clubs = shouldShowLockerRoomClubs
          ? (await Club.find({sportIDs: {$in: id}}).exec()).map((item: ClubDocument) => `Club:${item.id}`)
          : [];
        const fanGroups = (await FanGroup.find({...fanGroupFilter, sportIDs: {$in: id}}).exec()).map(
          (item: FanGroupDocument) => `FanGroup:${item.id}`
        );
        const groups = leagues.concat(clubs).concat(fanGroups);
        const items = await LockerRoom.aggregate([
          {$match: {group: {$in: groups}}},
          {
            $lookup: {
              from: 'GroupAggregates',
              localField: 'group',
              foreignField: 'group',
              as: 'Aggregates',
            },
          },
          {
            $addFields: {
              id: {$toString: '$_id'},
              supporters: {$arrayElemAt: ['$Aggregates.supporters', 0]},
              grouping: {
                $split: ['$group', ':'],
              },
            },
          },
          {
            $addFields: {
              rank: {
                $switch: {
                  branches: [
                    {case: {$eq: [{$arrayElemAt: ['$grouping', 0]}, 'League']}, then: 1},
                    {case: {$eq: [{$arrayElemAt: ['$grouping', 0]}, 'Club']}, then: 2},
                    {case: {$eq: [{$arrayElemAt: ['$grouping', 0]}, 'FanGroup']}, then: 3},
                  ],
                  default: 4,
                },
              },
            },
          },
          {
            $sort: {
              rank: 1,
              supporters: -1,
              createdAt: 1,
            },
          },
        ])
          .skip(cursor)
          .limit(count)
          .exec();
        // const items = await LockerRoom.find({group: {$in: groups}})
        //   .sort({group: 1})
        //   .skip(cursor)
        //   .limit(count)
        //   .exec();
        const length = items.length;
        return {
          count: length,
          next: length + cursor,
          total: await LockerRoom.countDocuments({group: {$in: groups}}),
          items,
        };
      },
    });
    t.nonNull.list.nonNull.field('LockerRoomsByLeague', {
      type: 'LockerRoomsByLeague',
      resolve: async ({id}) => {
        return (
          // await League.find({sportIDs: {$in: id}})
          //   .sort({boost: -1})
          //   .exec()
          (
            await League.aggregate([
              {
                $match: {
                  sportIDs: {$eq: id},
                },
              },
              {
                $addFields: {
                  id: {$toString: '$_id'},
                },
              },
              {
                $addFields: {
                  group: {$concat: ['League:', '$id']},
                },
              },
              {
                $lookup: {
                  from: 'GroupAggregates',
                  localField: 'group',
                  foreignField: 'group',
                  as: 'Aggregates',
                },
              },
              {
                $addFields: {
                  supporters: {$arrayElemAt: ['$Aggregates.supporters', 0]},
                },
              },
              {
                $sort: {
                  boost: -1,
                  supporters: -1,
                  createdAt: 1,
                },
              },
            ]).exec()
          ).map((item: LeagueDocument) => {
            return {leagueID: item.id, leagueName: item.name};
          })
        );
      },
    });
    t.nonNull.field('FanGroupLockerRooms', {
      type: 'LockerRooms',
      args: {
        count: intArg(),
        cursor: intArg(),
      },
      resolve: async ({id}, {count, cursor}) => {
        count ||= 100;
        cursor ||= 0;
        const fanGroups = (await FanGroup.find({...fanGroupFilter, sportIDs: {$in: id}}).exec()).map(
          (item: FanGroupDocument) => `FanGroup:${item.id}`
        );
        const items = await LockerRoom.aggregate([
          {$match: {group: {$in: fanGroups}}},
          {
            $lookup: {
              from: 'GroupAggregates',
              localField: 'group',
              foreignField: 'group',
              as: 'Aggregates',
            },
          },
          {
            $addFields: {
              id: {$toString: '$_id'},
              supporters: {$arrayElemAt: ['$Aggregates.supporters', 0]},
            },
          },
          {
            $sort: {
              supporters: -1,
              createdAt: 1,
            },
          },
        ])
          .skip(cursor)
          .limit(count)
          .exec();
        const length = items.length;
        return {
          count: length,
          next: length + cursor,
          total: await LockerRoom.countDocuments({group: {$in: fanGroups}}),
          items,
        };
      },
    });
    // t.nonNull.field('Leagues', {
    //   type: 'Leagues',
    //   args: {
    //     count: intArg(),
    //     cursor: intArg(),
    //   },
    //   resolve: async ({id}, {count, cursor}) => {
    //     count ||= 10;
    //     cursor ||= 0;
    //     const items = await League.find({sportIDs: {$in: id}})
    //       .sort({_id: 1})
    //       .skip(cursor)
    //       .limit(count)
    //       .exec();
    //     const length = items.length;
    //     return {
    //       count: length,
    //       next: length + cursor,
    //       total: await League.countDocuments({sportIDs: {$in: id}}),
    //       items,
    //     };
    //   },
    // });
    // t.nonNull.field('Clubs', {
    //   type: 'Clubs',
    //   args: {
    //     count: intArg(),
    //     cursor: intArg(),
    //   },
    //   resolve: async ({id}, {count, cursor}) => {
    //     count ||= 10;
    //     cursor ||= 0;
    //     const items = await Club.find({sportID: {$in: id}})
    //       .sort({_id: 1})
    //       .skip(cursor)
    //       .limit(count)
    //       .exec();
    //     const length = items.length;
    //     return {
    //       count: length,
    //       next: length + cursor,
    //       total: await Club.countDocuments({sportID: {$in: id}}),
    //       items,
    //     };
    //   },
    // });
  },
});
