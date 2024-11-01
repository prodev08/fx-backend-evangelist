// import {objectType} from 'nexus';
// import {League, Club} from 'lib-mongoose';
//
// export const Supporting = objectType({
//   name: 'Supporting',
//   definition(t) {
//     t.list.nonNull.string('leagueIDs');
//     t.list.nonNull.string('clubIDs');
//     // dynamic
//     t.list.nonNull.field('Leagues', {
//       type: 'League',
//       resolve: async ({leagueIDs}) => {
//         return await League.find({_id: {$in: leagueIDs}}).exec();
//       },
//     });
//     t.nonNull.list.field('Clubs', {
//       type: 'Club',
//       resolve: async ({clubIDs}) => {
//         return await Club.find({_id: {$in: clubIDs}}).exec();
//       },
//     });
//   },
// });
