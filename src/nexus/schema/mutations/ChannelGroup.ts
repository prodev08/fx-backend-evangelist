import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {Channel, ChannelDocument, ChannelGroup, ChannelGroupDocument, LockerRoom} from 'lib-mongoose';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import isUserOwnerOrManager from '../../../app/checker/isUserOwnerOrManager';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';
import {IAppResolverContext} from '../../../interfaces';
import createChannelGroup from '../../../app/creator/createChannelGroup';
import {channelFilter, channelGroupFilter} from '../../../utilities';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import channelGroupIDExists from '../../../app/checker/channelGroupIDExists';
import {UserInputError} from 'apollo-server-express';
import channelCountLimitReachedForUndelete from '../../../app/checker/channelCountLimitReachedForUndelete';

/*
Channel Group Mutations
Pre-requisite:
1. Require a logged in user.
2. Require a user account.

Creation:
1. Verify if inputted lockerRoomID exists.
2. Verify if user is owner/manager else throw an error.
3. Create the Channel Group doc.
4. If not successful, expect an error.
5. Else, continue with creating the Channel Group's GroupAggregate doc.
6. Then, increment the GroupAggregate (channelGroups) of the Locker Room to which this Channel Group belongs to.
7. Lastly, create User Role entry stating the owner of the newly created Channel Group.

Edit:
1. Verify if user is owner/manager else throw an error.
2. Update the Channel Group.
3. If not successful, return null.

Delete:
1. Verify if user is owner/manager else throw an error.
2. Verify if channelGroup exists.
3. Check if this is the only channel group left in locker room. If true, throw an error else proceed.
4. Set isDeleted: true in the Channel Group doc.
5. Decrement the GroupAggregate (channelGroups) of the Sport, Locker Room, League and/or Club or FanGroup to which this Channel Group belongs to.
6. Update global.lockerRoomIDToDefaultSlug list.
7. If not successful, return null.

Undelete:
1. Verify if user is owner/manager else throw an error.
2. Check number of channels the lockerRoom has once undeleted.
3. Set isDeleted: false in the Channel Group doc.
4. Increment the GroupAggregate (channelGroups) of the Sport, Locker Room, League and/or Club or FanGroup to which this Channel Group belongs to.
5. If not successful, return null.
 */

export interface IInputCreateChannelGroup {
  name: string;
  description?: string | null | undefined;
  lockerRoomID: string;
}
interface IInputEditChannelGroup {
  name: string;
  description?: string | null | undefined;
}

async function implementation(
  type: string,
  inputCreate: IInputCreateChannelGroup | null,
  inputEdit: IInputEditChannelGroup | null,
  id: string | null,
  context: IAppResolverContext
) {
  // 1. Require a logged in user.
  const {uid} = context;
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);
  const userID = customClaims.app.userID;

  if (type === 'create') {
    // 1. Verify if inputted lockerRoomID exists.
    const lockerRoomID = inputCreate!.lockerRoomID;
    await lockerRoomIDExists(lockerRoomID);
    // 2. Verify if user is owner/manager else throw an error.
    const group = (await LockerRoom.findById(lockerRoomID).exec())?.group;
    await isUserOwnerOrManager(group!, userID, `Creating ChannelGroup in group: ${group}`);
    // 3. Create the Channel Group doc.
    const result = await createChannelGroup(inputCreate!, group!);
    return result.id;
  }
  if (type === 'undelete') {
    const {group, lockerRoomID} = await channelGroupIDExists(id!, true);
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Undo Deleting ChannelGroup:${id}`);
    // 2. Check number of channels the lockerRoom has once undeleted.
    await channelCountLimitReachedForUndelete(lockerRoomID, id!);
    // 3. Set isDeleted: false in the Channel Group doc.
    const result = await ChannelGroup.findOneAndUpdate(
      {isDeleted: true, _id: stringToObjectId(id!)},
      {
        isDeleted: false,
        updatedAt: new Date().getTime(),
      }
    ).exec();
    if (result) {
      // 4. Increment the GroupAggregate (channelGroups) of the Sport, Locker Room, League and/or Club or FanGroup to which this Channel Group belongs to.
      await incrementGroupAggregates('channelGroups', 1, {group, id, lockerRoomID: result.lockerRoomID});
      const addedChannels = (await Channel.find({isDeleted: true, channelGroupID: id}, {id: 1}).exec()).map(
        (item: ChannelDocument) => item.id
      );
      await Channel.updateMany(
        {isDeleted: true, channelGroupID: id},
        {isDeleted: false, updatedAt: new Date().getTime()}
      );
      for (const addedChannel of addedChannels) {
        await incrementGroupAggregates('channels', 1, {group, id: addedChannel, lockerRoomID: result.lockerRoomID});
      }
    }
    // 5. If not successful, return null.
    return result?.id;
  }

  const channelGroup = await channelGroupIDExists(id!);
  const {group, lockerRoomID} = channelGroup;
  if (type === 'edit') {
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Editing ChannelGroup:${id}`);
    // 2. Update the Channel Group.
    const result = await ChannelGroup.findOneAndUpdate(
      {...channelGroupFilter, _id: stringToObjectId(id!)},
      {
        ...inputEdit,
        updatedAt: new Date().getTime(),
      }
    ).exec();
    // 3. If not successful, return null.
    return result?.id;
  }
  if (type === 'delete') {
    // 1. Verify if user is owner/manager else throw an error.
    await isUserOwnerOrManager(group, userID, `Deleting ChannelGroup:${id}`);
    // 2. Verify if channelGroup exists.
    // 3. Check if this is the only channel group left in locker room. If true, throw an error else proceed.
    const channelGroupIDs = (await ChannelGroup.find({...channelGroupFilter, lockerRoomID}, {id: 1}).exec()).map(
      (channelGroupItem: ChannelGroupDocument) => channelGroupItem.id.toString()
    );
    if (channelGroupIDs.length === 1) {
      // throw new UserInputError('Can no longer delete this channel group. Create another one first.');
      throw new UserInputError(
        'Every Locker Room must have at least 1 channel group, create another first and please try again'
      );
    }
    // 4. Set isDeleted: true in the Channel Group doc.
    const result = await ChannelGroup.findOneAndUpdate(
      {...channelGroupFilter, _id: stringToObjectId(id!)},
      {
        isDeleted: true,
        updatedAt: new Date().getTime(),
      }
    ).exec();
    if (result) {
      // 5. Decrement the GroupAggregate (channelGroups) of the Sport, Locker Room, League and/or Club or FanGroup to which this Channel Group belongs to.
      await incrementGroupAggregates('channelGroups', -1, {group, id, lockerRoomID: result.lockerRoomID});
      const deletedChannels = (await Channel.find({...channelFilter, channelGroupID: id}, {id: 1}).exec()).map(
        (item: ChannelDocument) => item.id
      );
      await Channel.updateMany(
        {...channelFilter, channelGroupID: id},
        {isDeleted: true, updatedAt: new Date().getTime()}
      );
      for (const deletedChannel of deletedChannels) {
        await incrementGroupAggregates('channels', -1, {group, id: deletedChannel, lockerRoomID: result.lockerRoomID});
      }
      // // 6. Update global.lockerRoomIDToDefaultSlug list.
      // global.lockerRoomIDToDefaultSlug[lockerRoomID] = await getDefaultChannelSlug(lockerRoomID);
    }
    // 7. If not successful, return null.
    return result?.id;
  }

  return null;
}

export const ChannelGroupMutations = mutationField(t => {
  t.nonNull.field('createChannelGroup', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputCreateChannelGroup')}),
    },
    resolve: async (source, {input}, context) => {
      const result = await implementation('create', input, null, null, context);
      return new MutationResult('ChannelGroup', result);
    },
  });
  t.nonNull.field('editChannelGroup', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputEditChannelGroup')}),
    },
    resolve: async (source, {id, input}, context) => {
      const result = await implementation('edit', null, input, id, context);
      return new MutationResult('ChannelGroup', result);
    },
  });
  t.nonNull.field('deleteChannelGroup', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('delete', null, null, id, context);
      return new MutationResult('ChannelGroup', result);
    },
  });
  t.nonNull.field('undeleteChannelGroup', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const result = await implementation('undelete', null, null, id, context);
      return new MutationResult('ChannelGroup', result);
    },
  });
});
