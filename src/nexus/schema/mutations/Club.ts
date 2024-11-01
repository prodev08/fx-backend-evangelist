import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {Club, GroupAggregates, LockerRoom, UserRole} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import leagueIDExists from '../../../app/checker/leagueIDExists';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import isUserOwnerOrManager from '../../../app/checker/isUserOwnerOrManager';
import sportIDCheckers from '../../../app/checker/sportIDCheckers';
import {IAppResolverContext} from '../../../interfaces';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import createLockerRoom from '../../../app/creator/createLockerRoom';
import createDefaultChannelGroupAndChannels from '../../../app/creator/createDefaultChannelGroupAndChannels';

/*
Club Mutations
Pre-requisite:
1. Require a logged in user.
2. Require a user account.

Creation:
1. Verify if inputted sportIDs is valid else throw an error.
2. Verify if inputted leagueID exists else throw an error.
3. Create the Club doc.
4. If not successful, expect an error.
5. Else, continue with creating the Club's GroupAggregate doc.
6. If inputted sportIDs is not null, increment the GroupAggregate (clubs) of the Sport to which this Club belongs to.
7. If inputted leagueID is not null, increment the GroupAggregate (clubs) of the League to which this Club belongs to.
8. Create the Locker Room doc.
9. Create Locker Room's GroupAggregate.
10. Create default channel group
11. Create default channels
12. Create User Role entry stating the owner of the newly created Club.
13. Increment supporters GroupAggregates in all related objects.
14. Lastly, increment supports UserAggregates of User.

Edit:
1. Verify if user is owner/manager else throw an error.
2. Update the Club.
3. Update the name of the Locker Room as well if name is updated.
 */

interface IInputCreateClub {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
  sportIDs: string[];
  leagueID: string;
}
interface IInputEditClub {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
}

async function implementation(
  type: string,
  inputCreate: IInputCreateClub | null,
  inputEdit: IInputEditClub | null,
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
    const {sportIDs, leagueID} = inputCreate!;
    // 1. Verify if inputted sportIDs is valid else throw an error.
    await sportIDCheckers(sportIDs);
    // 2. Verify if inputted leagueID exists else throw an error.
    await leagueIDExists(leagueID);
    // 3. Create the Club doc.
    const slug = await stringToSlug(Club, inputCreate!.name, false, true, false);
    // 4. If not successful, expect an error.
    const result = await Club.create({...inputCreate, slug});

    if (result) {
      // 5. Else, continue with creating the Club's GroupAggregate doc.
      const group = `Club:${result.id}`;
      await GroupAggregates.create({group});
      // 6. If inputted sportIDs is not null, increment the GroupAggregate (clubs) of the Sport to which this Club belongs to.
      // 7. If inputted leagueID is not null, increment the GroupAggregate (clubs) of the League to which this Club belongs to.
      await incrementGroupAggregates('clubs', 1, {
        sportIDs,
        leagueID,
      });
      // 8. Create the Locker Room doc.
      const lockerRoomResult = await createLockerRoom(inputCreate!.name, `Club:${result.id}`);
      const lockerRoomID = lockerRoomResult.id;
      // 10. Create default channel group
      // 11. Create default channels
      await createDefaultChannelGroupAndChannels(lockerRoomID, group);
      // 12. Create User Role entry stating the owner of the newly created Club.
      const userRoleData = {
        group,
        groupType: 'Club',
        groupID: result.id,
        userID,
        uid,
        role: 'owner',
        status: 'active',
        lockerRoomID,
        isPrimaryOwner: true,
      };
      await UserRole.create({...userRoleData});
      // 13. Increment supporters GroupAggregates in all related objects.
      // 14. Lastly, Increment supports UserAggregates of User.
      await incrementGroupAggregates('supporters', 1, {
        group,
        sportIDs,
        leagueID,
        lockerRoomID,
        userID,
      });
    }
    return result.id;
  }
  if (type === 'edit') {
    // check if user is either an owner or manager, else throw an error
    await isUserOwnerOrManager(`Club:${id}`, userID, `Editing Club:${id}`);
    const initialClubName = (await Club.findById(id).exec())?.name;

    const result = await Club.findByIdAndUpdate(id, {
      ...inputEdit,
      updatedAt: new Date().getTime(),
    }).exec();

    if (result) {
      if (initialClubName !== inputEdit?.name) {
        await LockerRoom.findOneAndUpdate({group: `Club:${id}`}, {name: inputEdit?.name}).exec();
      }
    }
    return result?.id;
  }
  return null;
}

export const ClubMutations = mutationField(t => {
  t.nonNull.field('createClub', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputCreateClub')}),
    },
    resolve: async (source, {input}, context) => {
      const result = await implementation('create', input, null, null, context);
      return new MutationResult('Club', result);
    },
  });
  t.nonNull.field('editClub', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputEditClub')}),
    },
    resolve: async (source, {id, input}, context) => {
      const result = await implementation('edit', null, input, id, context);
      return new MutationResult('Club', result);
    },
  });
});
