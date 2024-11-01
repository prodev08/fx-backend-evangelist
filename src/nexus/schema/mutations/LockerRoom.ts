import {list, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {LockerRoom, User, UserInvites, UserInvitesDocument, UserRole} from 'lib-mongoose';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import isUserOwnerOrManager from '../../../app/checker/isUserOwnerOrManager';
import isUserOwner from '../../../app/checker/isUserOwner';
import isUserForUpdateOwnerOrManager from '../../../app/checker/isUserForUpdateOwnerOrManager';
import userRoleTypeExists from '../../../app/checker/userRoleTypeExists';
import userIDExists from '../../../app/checker/userIDExists';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';
import isInviteeViaEmail from '../../../app/checker/isInviteeViaEmail';
import userInviteIDExists from '../../../app/checker/userInviteIDExists';
import getDefaultChannelSlug from '../../../app/getter/getDefaultChannelSlug';
import sendTemplatedEmail, {defaultSender} from '../../../app/email/sendTemplatedEmail';
import isUserFirstOwnerOfLockerRoom from '../../../app/checker/isUserFirstOwnerOfLockerRoom';
import isUserPrimaryOwner from '../../../app/checker/isUserPrimaryOwner';
import {ForbiddenError, UserInputError} from 'apollo-server-express';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import getUserRole from '../../../app/getter/getUserRole';
import {userFilter} from '../../../utilities';
import trackSupportLockerRoom from '../../../app/mixpanel/event/trackSupportLockerRoom';
import sportIDExists from '../../../app/checker/sportIDExists';
import leagueIDExists from '../../../app/checker/leagueIDExists';
import getGroup from '../../../app/getter/getGroup';

/*
Different scenarios covered:
A. Steps in inviting someone not in the platform - OK
  1. Use inviteUserForManagerialRole API to invite. UserInvite doc will be created.
  2. An email will be sent to that user with link.
  3. Upon clicking the link from the email, run invitedUserExists API that should return false then getUserInvite that should return the UserInvite entry if not yet expired.
  4. Since above API returned false, redirect to signup screen.
  4. Run respondUserManagerialRoleInvite API to create the user role and delete the UserInvite doc in the db. - OK

B. Steps in inviting someone in the platform - OK
  1. Use inviteUserForManagerialRole API to invite. UserRole doc will be created right away.
  2. An email will be sent to that user with no link.

C. Steps in inviting someone not in the platform then created an account but not through the link
  1. Use inviteUserForManagerialRole API to invite. UserInvite doc will be created.
  2. An email will be sent to that user with link.
  3. User created an account. Will not change the role still. Needs to click the link. But if re-invited please see D4.
  3. Upon clicking the link from the email, run invitedUserExists API that should return true then getUserInvite that should return the UserInvite entry if not yet expired.
  4. Since above API returned true, redirect to login screen.
  4. Run respondUserManagerialRoleInvite API to update the user role and delete the UserInvite doc in the db.

D. Steps in resending invitation
  1. Use inviteUserForManagerialRole API to re-invite.
  2. If user is still not in the platform, UserInvite doc will be updated. - OK
  3. If user is since then in the platform, UserRole doc will be updated. (Might not happen most likely but API is ready for such scenario) - OK
  4. If user was not in the platform before but is now there, UserInvite doc will be deleted and UserRole doc will be created. - OK
*/
export const LockerRoomMutations = mutationField(t => {
  t.nonNull.field('respondUserManagerialRoleInvite', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Verify legitimacy of invitee email vs logged in email.
      const user = await User.findOne({uid}).exec();
      await isInviteeViaEmail(id, user!.emailAddress!);
      // 4. Find UserInvite entry.
      const userInviteEntry: UserInvitesDocument = await userInviteIDExists(id);
      // 5. Check if Locker Room has primary owner.
      const {group, role, lockerRoomID, lockerRoomSlug} = userInviteEntry.data;
      const [objectType, objectID] = group!.split(':');
      const isPrimaryOwner = role === 'owner' ? await isUserFirstOwnerOfLockerRoom(lockerRoomID) : false;
      const userID = customClaims.app.userID;
      const userRoleData = {
        group,
        groupType: objectType,
        groupID: objectID,
        userID,
        uid,
        role,
        status: 'active',
        lockerRoomID,
        isPrimaryOwner,
      };
      // 6. Add/Update User Role. Depends whether existing role say supporter role exists. In that case just update the role.
      const result = await UserRole.findOneAndUpdate(
        {group, userID},
        {...userRoleData, updatedAt: new Date().getTime()},
        {upsert: true}
      ).exec();
      // 7. Delete the UserInvites doc created so that it won't accumulate in the db.
      await UserInvites.findByIdAndDelete(id).exec();
      if (!result) {
        // 8. Increment Aggregates if new user role was created.
        await incrementGroupAggregates('supporters', 1, {
          userID,
          lockerRoomID,
          group,
        });
      }
      const lockerRoomDefaultChannel = await getDefaultChannelSlug(lockerRoomID);
      return new MutationResult('User', `/locker-room/${lockerRoomSlug}/${lockerRoomDefaultChannel}`);
    },
  });
  t.nonNull.field('inviteUserForManagerialRole', {
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
      input: nonNull(list(nonNull('InputInviteUserForManagerialRole'))),
    },
    resolve: async (source, {lockerRoomID, input}, context) => {
      // NOTE: User can re-invite.
      const {uid, email} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Check if Locker Room exists.
      const {slug: lockerRoomSlug, group} = await lockerRoomIDExists(lockerRoomID);
      const userID = customClaims.app.userID;
      // 4. Check if user is either an owner or manager, else throw an error.
      const userRole = await isUserOwnerOrManager(group!, userID, `Inviting user in group: ${group}`);
      for (const data of input) {
        // 5. Check if role is valid.
        const role = data.role!;
        const emailAddress = data.emailAddress?.toLowerCase();
        // 6. Check who is inviting and prohibit user from inviting himself.
        if (emailAddress === email) {
          // throw new UserInputError('You cannot invite yourself.');
          throw new UserInputError('No need for an invite, you are already invited :)');
        }
        // 7. Check if user role exists.
        await userRoleTypeExists(role);
        // 8. Check if user is manager. If true should not invite an owner, otherwise throw an error.
        if (userRole.role === 'manager' && role === 'owner') {
          throw new UserInputError('Manager cannot invite a user to be an Owner.');
        }
        // 9. Check if user exists.
        const existingUser = await User.findOne({emailAddress, ...userFilter}).exec();
        const type = 'InviteUserInLockerRoomForManagerialRole';
        const userInviteData = {
          type,
          userID,
          group,
          data: {group, role, lockerRoomID, emailAddress, lockerRoomSlug},
        };
        const [objectType, objectID] = group!.split(':');
        const {name: groupName} = await getGroup(objectType, objectID, {name: 1});
        //const subject = `Invitation for a Managerial Role in ${groupName}`;
        const subject = 'Your invite to FX1';
        if (existingUser) {
          const userID = existingUser.id;
          const uid = existingUser.uid;
          // 10.1.1 Check if invited user is primary owner.
          await isUserPrimaryOwner(group!, userID, `Inviting user in group: ${group}`);
          // 10.1.2 Update UserRole - for instances where initially a user was invited as manager then was re-invited as owner vice versa.
          // 10.1.3 Check if invited user is either an owner or manager.
          const invitedUserRole = await getUserRole(group!, userID);
          if (invitedUserRole?.role === 'owner' && role === 'manager') {
            // throw new UserInputError('You cannot re-invite an Owner as Manager.');
            throw new UserInputError('This person is already assigned as an owner; they cannot also be a manager');
          }
          const isPrimaryOwner = role === 'owner' ? await isUserFirstOwnerOfLockerRoom(lockerRoomID) : false;
          // 10.1.4 Create/Update User Role.
          const userRoleExists = await UserRole.findOneAndUpdate(
            {group, groupType: objectType, groupID: objectID, userID, uid, status: 'active', lockerRoomID},
            {role, isPrimaryOwner, updatedAt: new Date().getTime()},
            {upsert: true}
          );
          // 10.1.5 Delete prior invitation - for instances where owner initially invite user then user didn't used the link to signup, so owner just resends an invitation now the user as an existing user.
          await UserInvites.findOneAndDelete({
            group,
            type,
            'data.emailAddress': emailAddress,
            'data.lockerRoomID': lockerRoomID,
          }).exec();
          if (!userRoleExists) {
            // 10.1.6 Increment Aggregates if new user role was created.
            await incrementGroupAggregates('supporters', 1, {
              userID,
              lockerRoomID,
              group,
            });
            // 10.1.7 Trigger Support Locker Room Mixpanel Event
            let sportIDs, name, leagueID, leagueName;
            switch (objectType) {
              case 'Club':
                ({sportIDs, name, leagueID} = await getGroup(objectType, objectID, {
                  sportIDs: 1,
                  name: 1,
                  leagueID: 1,
                }));
                leagueName = (await leagueIDExists(leagueID)).name;
                break;
              default:
                ({sportIDs, name} = await getGroup(objectType, objectID, {sportIDs: 1, name: 1}));
                leagueName = null;
                break;
            }
            const sport = (await sportIDExists(sportIDs))!.name;
            await trackSupportLockerRoom(
              'Support Locker Room',
              {
                sport,
                lockerRoomType: objectType,
                league: leagueName,
                name: name,
                platform: 'Web',
                pageName: 'Invite Managers',
              },
              {ip: null, uid}
            );
          }

          // 10.1.8 Send email.
          let article = 'a';
          if (role === 'owner') {
            article = 'an';
          }

          await sendTemplatedEmail('inviteUserWithManagerialRoleWithoutLink', {
            subject,
            recipients: [emailAddress!],
            sender: defaultSender,
            data: {
              article,
              role,
              groupName,
              redirectingDomain: global.baseURL,
              lockerRoomSlug,
            },
          });
        } else {
          // 10.2.1 If user does not exist, create or update UserInvites entry. Depends if user was already invited.
          const result = (
            await UserInvites.findOneAndUpdate(
              {group, type, 'data.emailAddress': emailAddress?.trim(), 'data.lockerRoomID': lockerRoomID},
              {...userInviteData, time: new Date().getTime(), expiration: new Date().getTime() + 86400000},
              {upsert: true, new: true}
            )
          ).id;
          const url = `${global.baseURL}/user/invite?accept=${result}`;
          // 10.2.2 Insert url.
          await UserInvites.findByIdAndUpdate(result, {url});
          // 10.2.3 Send email with link.
          let article = 'a';
          if (role === 'owner') {
            article = 'an';
          }

          await sendTemplatedEmail('inviteUserWithManagerialRoleWithLink', {
            subject,
            recipients: [emailAddress!],
            sender: defaultSender,
            data: {
              article,
              role,
              groupName,
              redirectingDomain: global.baseURL,
              id: result,
              lockerRoomSlug,
            },
          });
        }
      }

      return new MutationResult('User', null);
    },
  });
  t.nonNull.field('removeUserManagerialRole', {
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
      userID: nonNull(stringArg()),
      role: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID, userID, role}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Check if user is an owner, else throw an error.
      const group = (await lockerRoomIDExists(lockerRoomID))?.group;
      await isUserOwner(group!, customClaims.app.userID, `Removing user in group: ${group}`);
      // 4. Check if role is valid.
      // 5. UserID exists.
      // 6. Check if User is Primary Owner.
      // 7. Delete Role.
      // 8. Send an Email for Notification about the ownership removal.
      const result = await funcRemoveUserManagerialRole(lockerRoomID, userID, group!, role);
      return new MutationResult('User', result.id);
    },
  });
  t.nonNull.field('editLockerRoomUserRole', {
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
      userID: nonNull(stringArg()),
      role: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID, userID, role}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Check if user is an owner, else throw an error.
      const group = (await lockerRoomIDExists(lockerRoomID)).group;
      await isUserOwner(group!, customClaims.app.userID, `Updating user in group: ${group}`);
      // 4. Check if role is valid.
      // 5. UserID exists.
      // 6. Check if User is Primary Owner.
      // 7. Edit Role.
      const result = await funcEditLockerRoomUserRole(lockerRoomID, userID, group, role);
      return new MutationResult('User', result.id);
    },
  });
  t.nonNull.field('updateLockerRoomUserRoles', {
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
      input: nonNull(list(nonNull('InputUpdateLockerRoomUserRoles'))),
    },
    resolve: async (source, {lockerRoomID, input}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Check if user is an owner, else throw an error.
      const group = (await lockerRoomIDExists(lockerRoomID))?.group;
      await isUserOwner(group!, customClaims.app.userID, `Updating user in group: ${group}`);

      for (const data of input) {
        if (data.type === 'edit') {
          // 4. Check if role is valid.
          // 5. UserID exists.
          // 6. Check if User is Primary Owner.
          // 7. Edit Role.
          await funcEditLockerRoomUserRole(lockerRoomID, data.userID, group, data.role!);
        }
        if (data.type === 'delete') {
          // 4. Check if role is valid.
          // 5. UserID exists.
          // 6. Check if User is Primary Owner.
          // 7. Delete Role.
          // 8. Send an Email for Notification about the ownership removal.
          await funcRemoveUserManagerialRole(lockerRoomID, data.userID, group!, data.role!);
        }
      }
      return new MutationResult('User', null);
    },
  });
});

async function funcRemoveUserManagerialRole(lockerRoomID: string, userID: string, group: string, role: string) {
  // Check if role is valid.
  await userRoleTypeExists(role);
  // UserID exists.
  await userIDExists(userID);
  // Prohibit Primary Owner to remove his/her role that is owner with isPrimaryOwner: true.
  await isUserPrimaryOwner(group!, userID, `Removing user privileges in group: ${group}`);
  // Edit Role.
  const result = await UserRole.findOneAndUpdate(
    {lockerRoomID, userID, role},
    {role: 'supporter', isPrimaryOwner: false, updatedAt: new Date().getTime()}
  ).exec();
  if (!result) {
    throw new UserInputError('User with this position does not exist.');
  }
  // Send email if owner.
  if (result && role === 'owner') {
    const emailAddress = (await User.findById(userID).exec())?.emailAddress;
    const [objectType, objectID] = result.group.split(':');
    const {name: groupName} = await getGroup(objectType, objectID, {name: 1});
    const subject = `Removed as an Owner for the ${groupName}`;
    await sendTemplatedEmail('removeOwnerNotification', {
      subject,
      recipients: [emailAddress!],
      sender: defaultSender,
      data: {
        role,
        groupName,
      },
    });
  }
  // Send email if manager.
  if (result && role === 'manager') {
    const emailAddress = (await User.findById(userID).exec())?.emailAddress;
    const [objectType, objectID] = result.group.split(':');
    const {name: groupName} = await getGroup(objectType, objectID, {name: 1});
    const subject = `Removed as a Manager for the ${groupName}`;
    await sendTemplatedEmail('removeManagerNotification', {
      subject,
      recipients: [emailAddress!],
      sender: defaultSender,
      data: {
        role,
        groupName,
      },
    });
  }
  return result.id;
}
async function funcEditLockerRoomUserRole(lockerRoomID: string, userID: string, group: string, role: string) {
  // Check if role is valid.
  await userRoleTypeExists(role);
  // UserID exists.
  await userIDExists(userID);
  // Check if user role to be updated is either an owner or manager, else throw an error. Use inviteUserForManagerialRole API if user's role is supporter or no user role yet.
  await isUserForUpdateOwnerOrManager(group!, userID, `Updating user in group: ${group}`);
  // Check desired role, only allow owner/manager roles.
  if (role === 'supporter') {
    throw new UserInputError('Appointed role should only be owner/manager.');
  }
  // Prohibit Primary Owner to edit his/her role that is owner with isPrimaryOwner: true.
  await isUserPrimaryOwner(group!, userID, `Editing user privileges in group: ${group}`);
  // Edit Role.
  const result = await UserRole.findOneAndUpdate(
    {lockerRoomID, userID},
    {role, updatedAt: new Date().getTime()}
  ).exec();

  const lockerRoomSlug = (await LockerRoom.findById(lockerRoomID).exec())?.slug;
  // Send email if manager.
  if (result && role === 'owner') {
    const emailAddress = (await User.findById(userID).exec())?.emailAddress;
    const [objectType, objectID] = result.group.split(':');
    const {name: groupName} = await getGroup(objectType, objectID, {name: 1});
    const subject = `Promoted as an Owner for the ${groupName}`;
    await sendTemplatedEmail('promotionOwnerNotification', {
      subject,
      recipients: [emailAddress!],
      sender: defaultSender,
      data: {
        role,
        groupName,
        redirectingDomain: global.baseURL,
        lockerRoomSlug,
      },
    });
  }
  if (!result) {
    // throw new ForbiddenError('Unable to update user role for the given user.');
    throw new ForbiddenError(
      'Sorry, there was an error in updating the role for this user. Please try again later and contact us if the issue persists'
    );
  }

  return result.id;
}
