import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {ProfileAction, User, UserAggregates, UserRole, ZipCode} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import updateAuthUserClaims from '../../../app/firebase/updateAuthUserClaims';
import {IAppResolverContext} from '../../../interfaces';
import userNameChecker from '../../../app/checker/userNameChecker';
import * as admin from 'firebase-admin';
import {AuthenticationError, ForbiddenError, UserInputError} from 'apollo-server-express';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import userIDExists from '../../../app/checker/userIDExists';
import autoSupportFX1SupportLockerRoom from '../../../app/creator/autoSupportFX1SupportLockerRoom';
import isValidUSZipCode from '../../../app/checker/isValidUSZipCode';
import isUserLoggedIn from '../../../app/checker/isUserLoggedIn';

/*
2 Ways to Sign Up:
1. Via email and password -> Passed arg will only be the username.
Its slug will be the username too. As username's uniqueness will be checked prior.
2. Via Google -> Passed args will be firstName and lastName -> extracted via getAdditionalUserInfo on the client side.
Challenge here is no username will be passed so it will be coming from the combination of firstName and lastName.
Result will also be the slug.
 */
interface IInputUser {
  username?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
}

async function implementation(type: string, input: IInputUser | null, context: IAppResolverContext) {
  const {uid, email: emailAddress} = context;
  requireLoggedIn(uid);

  if (type === 'create') {
    input!.username = input!.username?.toLowerCase().trim();
    if (!input!.username && (!input!.firstName || !input!.lastName)) {
      throw new UserInputError('Input required.');
    }
    if (input!.username) {
      await userNameChecker(input!.username);
    }

    input!.firstName = input!.firstName?.trim();
    input!.lastName = input!.lastName?.trim();

    const baseSlug =
      input!.firstName && input!.lastName
        ? `${input!.firstName} ${input!.lastName}`.toLowerCase()
        : `${input!.username}`.toLowerCase();
    const slug = await stringToSlug(User, baseSlug, false, true, false);

    const username = await stringToSlug(User, baseSlug, false, false, true);
    input!.username = input!.username ? input!.username : username;

    const result = await User.create({...input, slug, uid, emailAddress});
    // await updateAuthUserProperties(uid!);
    await updateAuthUserClaims(uid!, result.id);

    await UserAggregates.create({userID: result.id});

    // automatic support fx-1 lockerRoom
    const userID = result.id;
    await autoSupportFX1SupportLockerRoom(userID, uid);
    return userID;
  }
  if (type === 'edit') {
    const customClaims = await requireHasUserAccount(uid);
    const userID = customClaims.app.userID;
    const result = await User.findByIdAndUpdate(userID, input!).exec();
    return result?.id;
  }
  if (type === 'delete') {
    const customClaims = await requireHasUserAccount(uid);
    const userID = customClaims.app.userID;
    const baseSlug = 'fx1user';
    const username = await stringToSlug(User, baseSlug, false, false, true);
    const result = await User.findByIdAndUpdate(userID, {
      username,
      firstName: 'FX1',
      lastName: 'User',
      isActive: false,
    }).exec();
    if (result) {
      const myUserRoles = await UserRole.find({userID}).exec();
      for (const userRole of myUserRoles) {
        const {lockerRoomID, group} = userRole;
        await incrementGroupAggregates('supporters', -1, {
          userID,
          lockerRoomID,
          group,
        });
      }
      await UserRole.deleteMany({userID}).exec();
      await admin.auth().deleteUser(uid!);
    }
    return result?.id;
  }
  return null;
}
async function blockingImplementation(type: string, targetUserID: string, context: IAppResolverContext) {
  const {userID: actorUserID} = context;
  if (!actorUserID) {
    throw new UserInputError('actorUserID is required.');
  }
  if (targetUserID === '') {
    throw new UserInputError('targetUserID is required.');
  }
  await userIDExists(actorUserID);
  await userIDExists(targetUserID);
  const action = 'Block';

  if (type === 'block') {
    await ProfileAction.findOneAndUpdate(
      {action, actorUserID, targetUserID},
      {action, actorUserID, targetUserID},
      {upsert: true, new: true}
    ).exec();
  }
  if (type === 'unblock') {
    return await ProfileAction.findOneAndDelete({action, actorUserID, targetUserID}).exec();
  }
  return null;
}
async function addZipCodeImplementation(zipCode: string, context: IAppResolverContext) {
  const {uid} = context;
  const zipCodeFound = await isValidUSZipCode(zipCode);
  await ZipCode.findOneAndUpdate({zip: zipCodeFound.zip}, {...zipCodeFound}, {upsert: true, new: true})
    .exec()
    .then(async () => {
      if (isUserLoggedIn(uid)) {
        await User.findOneAndUpdate({uid}, {zipCode}).exec();
      }
    });
  return zipCodeFound;
}

export const UserMutations = mutationField(t => {
  t.nonNull.field('createUser', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputUser')}),
    },
    resolve: async (source, {input}, context) => {
      const result = await implementation('create', input, context);
      return new MutationResult('User', result);
    },
  });
  t.nonNull.field('editUser', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputEditUser')}),
    },
    resolve: async (source, {input}, context) => {
      const result = await implementation('edit', input, context);
      return new MutationResult('User', result);
    },
  });
  t.nonNull.field('deleteUser', {
    type: 'MutationResult',
    resolve: async (source, args, context) => {
      const result = await implementation('delete', null, context);
      return new MutationResult('User', result);
    },
  });
  t.nonNull.field('deleteFirebaseAccount', {
    type: 'MutationResult',
    resolve: async (source, args, context) => {
      const {uid} = context;
      if (!uid) {
        throw new AuthenticationError('Invalid Token.');
      }
      const exists = await User.findOne({uid}).exec();
      if (exists) {
        throw new ForbiddenError('Can no longer delete this. User has an existing account.');
      }
      await admin.auth().deleteUser(uid!);
      return new MutationResult('User', null);
    },
  });
  t.nonNull.field('blockUser', {
    type: 'MutationResult',
    args: {
      targetUserID: nonNull(stringArg()),
    },
    resolve: async (source, {targetUserID}, context) => {
      await blockingImplementation('block', targetUserID, context);
      return new MutationResult('User', targetUserID);
    },
  });
  t.nonNull.field('unblockUser', {
    type: 'MutationResult',
    args: {
      targetUserID: nonNull(stringArg()),
    },
    resolve: async (source, {targetUserID}, context) => {
      await blockingImplementation('unblock', targetUserID, context);
      return new MutationResult('User', targetUserID);
    },
  });
  t.nonNull.field('addZipCode', {
    type: 'ZipCode',
    args: {
      zipCode: nonNull(stringArg()),
    },
    resolve: async (source, {zipCode}, context) => {
      return await addZipCodeImplementation(zipCode, context);
    },
  });
});
