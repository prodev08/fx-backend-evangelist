import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {Channel, UserRole, UserInvites} from 'lib-mongoose';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import channelGroupIDExists from '../../../app/checker/channelGroupIDExists';
import channelTypeExists from '../../../app/checker/channelTypeExists';
import isUserOwnerOrManager from '../../../app/checker/isUserOwnerOrManager';
import channelCountLimitReached from '../../../app/checker/channelCountLimitReached';
import {IAppResolverContext} from '../../../interfaces';
import createChannel from '../../../app/creator/createChannel';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import {channelFilter} from '../../../utilities';
import {UserInputError} from 'apollo-server-express';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import channelIDExists from '../../../app/checker/channelIDExists';
import getChannelSlugs from '../../../app/getter/getChannelSlugs';
import isPrivateChatForGame from '../../../app/checker/isPrivateChatForGame';
import createUserRole from '../../../app/creator/createUserRole';
import userIDExists from '../../../app/checker/userIDExists';
import privateChannelIDExists from '../../../app/checker/PrivateChannelIDExists';
import isOwnerOfPrivateChannel from '../../../app/checker/isOwnerOfPrivateChannel';
import gameIDExists from '../../../app/checker/gameIDExists';

/*
Channel Mutations
Pre-requisite:
1. Require a logged in user.
2. Require a user account.

Creation:
1. Verify if inputted channelGroupID exists else throw an error.
2. Verify if user is owner/manager else throw an error.
3. Verify if inputted type exists else throw an error.
4. Verify if Channel max limit reached.
5. Create the Channel doc and increment all related groupAggregates.

Edit:
1. Verify if user is owner/manager else throw an error.
2. Verify if inputted type exists else throw an error.
3. Update the Channel.
4. If not successful, return null.

Delete:
1. Verify if user is owner/manager else throw an error.
2. Check if this is the only channel left in locker room. If true, throw an error else proceed.
3. Delete("Update") the Channel.
4. Decrement all related aggregates for the Channel.
5. Update global.lockerRoomIDToDefaultSlug list.
6. If not successful, return null.

Un-Delete:
1. Verify if user is owner/manager else throw an error.
2. Check number of channels the lockerRoom has.
3. Undo Delete("Update") the Channel.
4. Increment all related aggregates for the Channel.
5. If not successful, return null.
 */

export interface IInputCreateChannel {
  name: string;
  description?: string | null | undefined;
  channelGroupID: string;
  type: string;
}
interface IInputEditChannel {
  name: string;
  description?: string | null | undefined;
  type: string;
}

async function implementation(
  type: string,
  inputCreate: IInputCreateChannel | null,
  inputEdit: IInputEditChannel | null,
  id: string | null,
  context: IAppResolverContext
) {
  const {uid} = context;
  // 1. Require a logged in user.
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);
  const userID = customClaims.app.userID;

  if (type === 'create') {
    const {channelGroupID, type} = inputCreate!;
    // 1. Verify if inputted channelGroupID exists else throw an error.
    const channelGroup = await channelGroupIDExists(channelGroupID);
    const {group, lockerRoomID} = channelGroup!;
    const groupType = group.split(':')[0];
    // 2. Verify if user is owner/manager else throw an error if channelGroup is not for Game.
    //    Verify if Channel max limit reached if channelGroup is not for Game.
    if (groupType !== 'Game') {
      await isUserOwnerOrManager(group, userID, `Creating Channel on ChannelGroup:${channelGroupID}`);
      await channelCountLimitReached(lockerRoomID);
    }
    // 3. Verify if inputted type exists else throw an error.
    channelTypeExists(type);
    // 4. Verify if the channel to be created is private when creating private channel.
    isPrivateChatForGame(type, groupType);
    // 5. Create the Channel doc and increment all related groupAggregates.
    // if (type === 'Private' && inputCreate) {
    //   inputCreate.name = 'My private group';
    //   inputCreate.description = 'Private channel for this game.';
    // }
    const result = await createChannel(inputCreate!, lockerRoomID);
    if (groupType === 'Game') {
      await createUserRole({
        group: `Channel:${result._id}`,
        groupType: 'Channel',
        groupID: result._id.toString(),
        userID: userID?.toString(),
        uid: uid!.toString(),
        role: 'owner',
        status: 'active',
        lockerRoomID,
      });
    }
    return result.id;
  }
  if (type === 'undelete') {
    const channelGroupID = (await channelIDExists(id!, true)).channelGroupID;
    const channelGroup = await channelGroupIDExists(channelGroupID);
    const {group, lockerRoomID} = channelGroup;
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Undo Deleting Channel:${id}`);
    // 2. Check number of channels the lockerRoom has.
    await channelCountLimitReached(lockerRoomID);
    // 3. Undo Delete("Update") the Channel.
    const result = await Channel.findOneAndUpdate(
      {isDeleted: true, _id: stringToObjectId(id!)},
      {isDeleted: false, updatedAt: new Date().getTime()}
    ).exec();
    // 4. Increment all related aggregates for the Channel.
    if (result) {
      await incrementGroupAggregates('channels', 1, {group, id, lockerRoomID});
    }
    // 5. If not successful, return null.
    return result?.id;
  }

  const channelGroupID = (await channelIDExists(id!)).channelGroupID;
  const channelGroup = await channelGroupIDExists(channelGroupID);
  const {group, lockerRoomID} = channelGroup;
  if (type === 'edit') {
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Editing Channel:${id}`);
    // 2. Verify if inputted type exists else throw an error.
    channelTypeExists(inputEdit!.type);
    // 3. Update the Channel.
    const result = await Channel.findOneAndUpdate(
      {...channelFilter, _id: stringToObjectId(id!)},
      {
        ...inputEdit,
        updatedAt: new Date().getTime(),
      }
    ).exec();
    // 4. If not successful, return null.
    return result?.id;
  }
  if (type === 'delete') {
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Deleting Channel:${id}`);
    // 2. Check if this is the only channel left in locker room. If true, throw an error else proceed.
    const channelSlugs = await getChannelSlugs(lockerRoomID);
    if (channelSlugs.length === 1) {
      // throw new UserInputError('Can no longer delete this channel. Create another one first.');
      throw new UserInputError(
        'Every Locker Room must have at least 1 channel, create another first and please try again'
      );
    }
    // 3. Delete("Update") the Channel.
    const result = await Channel.findOneAndUpdate(
      {...channelFilter, _id: stringToObjectId(id!)},
      {isDeleted: true, updatedAt: new Date().getTime()}
    ).exec();

    if (result) {
      // 4. Decrement all related aggregates for the Channel.
      await incrementGroupAggregates('channels', -1, {group, id, lockerRoomID});
      // 5. Update global.lockerRoomIDToDefaultSlug list.
      // global.lockerRoomIDToDefaultSlug[lockerRoomID] = await getDefaultChannelSlug(lockerRoomID);
    }
    // 6. If not successful, return null.
    return result?.id;
  }

  return null;
}

export const ChannelMutations = mutationField(t => {
  t.nonNull.field('createChannel', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputCreateChannel')}),
    },
    resolve: async (source, {input}, context) => {
      // const result = await implementation('create', input, null, null, null, context);
      const result = await implementation('create', input, null, null, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('editChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputEditChannel')}),
    },
    resolve: async (source, {id, input}, context) => {
      // const result = await implementation('edit', null, input, null, id, context);
      const result = await implementation('edit', null, input, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('deleteChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('delete', null, null, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('undeleteChannel', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('undelete', null, null, id, context);
      return new MutationResult('Channel', result);
    },
  });
  t.nonNull.field('leavePrivateChannel', {
    type: 'MutationResult',
    args: {
      privateChannelID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Verify if inputted privateChannel exists.
      const channel = await privateChannelIDExists(privateChannelID);
      // 4. Run findOneAndDelete to remove from UserRole.
      const group = `Channel:${channel._id}`;
      const userID = customClaims.app.userID;
      await UserRole.findOneAndDelete({group, uid, userID, role: 'joiner'}).exec();

      return new MutationResult('leavePrivateChannel', group!.split(':')[1]);
    },
  });
  t.nonNull.field('addMembersToPrivateChannel', {
    type: 'MutationResult',
    args: {
      privateChannelID: nonNull(stringArg()),
      userIDs: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, userIDs}, {uid}) => {
      // 1. Require a user logged in.
      requireLoggedIn(uid);
      // 2. Require a user account.
      await requireHasUserAccount(uid);
      // 3. Verify if inputted privatechannel exists.
      const channel = await privateChannelIDExists(privateChannelID);
      // 4. Verify if the user is owner of the private channel
      await isOwnerOfPrivateChannel(privateChannelID, uid);
      // 5. Add members
      userIDs.split(',').forEach(async (id: string) => {
        const user = await userIDExists(id);
        await createUserRole({
          group: `Channel:${channel._id}`,
          groupType: 'Channel',
          groupID: channel._id.toString(),
          userID: id,
          uid: user.uid.toString(),
          role: 'joiner',
          status: 'active',
          lockerRoomID: channel.lockerRoomID,
        });
      });

      return new MutationResult('addMembersToPrivateChannel');
    },
  });
  t.nonNull.field('generateInviteUrlToPrivateChannel', {
    type: 'MutationResultWithInviteUrl',
    args: {
      privateChannelID: nonNull(stringArg()),
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, gameID}, {uid, userID}) => {
      // 1. Require a user logged in.
      requireLoggedIn(uid);
      // 2. Require a user account.
      await requireHasUserAccount(uid);
      // 3. Verify if inputted privatechannel exists.
      await privateChannelIDExists(privateChannelID);
      // 4. Verify if inputted game exists.
      await gameIDExists(gameID);

      const invite = await UserInvites.create({
        group: `Channel:${privateChannelID}`,
        type: 'InviteToPrivateChannel',
        expiration: new Date().getTime() + 24 * 3600000, // 1d
        userID,
        data: {gameID},
      });

      invite.url = `${process.env.BASE_URL}/user/invite?accept=${invite.id}`;
      await invite.save();

      const mutationResult = new MutationResult('UserInvite', invite.id);

      return {
        ...mutationResult,
        inviteUrl: invite.url,
      };
    },
  });
});
