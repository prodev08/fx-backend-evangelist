import {objectType} from 'nexus';
import {GroupAggregates, League} from 'lib-mongoose';
import getDefaultChannelSlug from '../../../app/getter/getDefaultChannelSlug';
import getLockerRoomViaGroup from '../../../app/getter/getLockerRoomViaGroup';

export const Club = objectType({
  name: 'Club',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.list.nonNull.string('sportIDs');
    t.field('Avatar', {type: 'Media'});
    t.field('CoverPhoto', {type: 'Media'});
    t.string('leagueID');
    t.boolean('isFeatured');

    //dynamic
    t.string('defaultChannelSlug', {
      resolve: async ({id}) => {
        const lockerRoomID = (await getLockerRoomViaGroup(`Club:${id}`))?.id;
        return lockerRoomID ? await getDefaultChannelSlug(lockerRoomID.toString()) : null;
      },
    });
    t.string('leagueName', {
      resolve: async ({leagueID}) => {
        return leagueID ? (await League.findById(leagueID).exec())?.name || null : null;
      },
    });
    t.int('supporterCount', {
      resolve: async ({id}) => {
        return (await GroupAggregates.findOne({group: `Club:${id}`}).exec())?.supporters || 0;
      },
    });
  },
});
