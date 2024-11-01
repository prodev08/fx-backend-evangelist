import {intArg, objectType} from 'nexus';
import {Club, ClubDocument, LockerRoom, LockerRoomDocument, Utilities} from 'lib-mongoose';

export const LockerRoomsByLeague = objectType({
  name: 'LockerRoomsByLeague',
  definition(t) {
    t.nonNull.string('leagueID');
    t.nonNull.string('leagueName');

    // dynamic
    t.nonNull.field('LockerRooms', {
      type: 'LockerRooms',
      args: {
        count: intArg(),
        cursor: intArg(),
      },
      resolve: async ({leagueID}, {count, cursor}) => {
        count ||= 100;
        cursor ||= 0;
        const showLockerRoomClubs = (await Utilities.findOne({key: 'showLockerRoomClubs'}).exec())?.value;
        const shouldShowLockerRoomClubs = showLockerRoomClubs === undefined ? true : showLockerRoomClubs;
        const clubs = shouldShowLockerRoomClubs
          ? (await Club.find({leagueID}).exec()).map((item: ClubDocument) => `Club:${item.id}`)
          : [];
        const items: LockerRoomDocument[] = await LockerRoom.aggregate([
          {$match: {$or: [{group: `League:${leagueID}`}, {group: {$in: clubs}}]}},
          {
            $addFields: {
              id: {$toString: '$_id'},
            },
          },
          {
            $addFields: {
              lockerRoomGroup: {$concat: ['LockerRoom:', '$id']},
            },
          },
          {
            $lookup: {
              from: 'GroupAggregates',
              localField: 'lockerRoomGroup',
              foreignField: 'group',
              as: 'Aggregates',
            },
          },
          {
            $addFields: {
              supporters: {$arrayElemAt: ['$Aggregates.supporters', 0]},
              grouping: {
                $split: ['$group', ':'],
              },
            },
          },
          {
            $addFields: {
              rank: {
                $cond: {
                  if: {$eq: ['League', {$arrayElemAt: ['$grouping', 0]}]},
                  then: 1,
                  else: 2,
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
        // const items = await LockerRoom.find({$or: [{group: `League:${leagueID}`}, {group: {$in: clubs}}]})
        //   .sort({group: -1})
        //   .skip(cursor)
        //   .limit(count)
        //   .exec();
        const length = items.length;
        return {
          count: length,
          next: length + cursor,
          total: await LockerRoom.countDocuments({group: {$in: clubs}}),
          items,
        };
      },
    });
  },
});
