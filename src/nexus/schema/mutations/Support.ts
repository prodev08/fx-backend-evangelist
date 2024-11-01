import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import supportLockerRoom from '../../../app/creator/supportLockerRoom';

/*
Support Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted lockerRoomID exists.
4. Check if currently an owner/manager/supporter to avoid replacing current role as all 3 are considered supporters.
5. Create if User Role does not exists.
6. Then, increment the UserAggregate (supports) of the User performing the action.
7. Then, increment the GroupAggregate (supporters) of the locker room that the user supported.
8. Then, increment the GroupAggregate (supporters) of the club/league/fanGroup/inHouse that the user supported.
9. Then, increment the GroupAggregate (supporters) of the sports that the user supported.
10. Then, increment the GroupAggregate (supporters) of the league where the club is under.
11. Lastly, auto read all messages in lockerRoom.
 */

export const SupportMutations = mutationField(t => {
  t.nonNull.field('support', {
    description: 'If UserRole exists as owner/manager, no changes will be made.',
    type: 'MutationResult',
    args: {
      lockerRoomID: nonNull(stringArg()),
    },
    resolve: async (source, {lockerRoomID}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      const userID = customClaims.app.userID;
      const objectID = await supportLockerRoom(lockerRoomID, userID, uid);
      return new MutationResult('Support', objectID);
    },
  });
});
