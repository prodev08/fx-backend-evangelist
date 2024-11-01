import {objectType} from 'nexus';
import {Channel, UserRole} from 'lib-mongoose';
import {channelFilter} from '../../../utilities';

export const ChannelGroup = objectType({
  name: 'ChannelGroup',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.nonNull.string('group');
    t.nonNull.string('lockerRoomID');
    t.boolean('isDeleted');
    t.boolean('withLivestream');

    // // dynamic
    // t.field('Club', {
    //   type: 'Club',
    //   resolve: async ({group}, args, {loaders}) => {
    //     const [objectType, objectID] = group.split(':');
    //     return objectType === 'Club' && group.startsWith('Club')
    //       ? (await loaders?.findClubByID.load(objectID!)) || null
    //       : null;
    //   },
    // });
    // t.field('League', {
    //   type: 'League',
    //   resolve: async ({group}, args, {loaders}) => {
    //     const [objectType, objectID] = group.split(':');
    //     return objectType === 'League' && group.startsWith('League')
    //       ? (await loaders?.findLeagueByID.load(objectID!)) || null
    //       : null;
    //   },
    // });
    t.list.field('Channels', {
      type: 'Channel',
      resolve: async ({id, lockerRoomID}, args, {userID}) => {
        const hasPrivate = await UserRole.findOne({lockerRoomID, groupType: 'Channel', userID});
        let channels = Channel.find({...channelFilter, channelGroupID: id});
        if (!hasPrivate) channels = channels.find({type: 'Public'});
        return await channels.exec();
      },
    });
  },
});
