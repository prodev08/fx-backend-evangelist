import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {LockerRoom, UserRole} from 'lib-mongoose';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import lockerRoomIDExists from '../../../app/checker/lockerRoomIDExists';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';

/*
Unsupport Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted lockerRoomID exists.
4. Run findOneAndDelete to remove from UserRole.
5. Decrement the UserAggregate (supports) of the User performing the action.
6. Decrement the GroupAggregate (supporters) of the locker room that the user supported.
7. Then, decrement the GroupAggregate (supporters) of the club/league that the user supported.
8. Then, decrement the GroupAggregate (supporters) of the sports that the user supported.
9. Lastly, decrement the GroupAggregate (supporters) of the league where the club is under.
 */

export const UnsupportMutations = mutationField(t => {
  t.nonNull.field('unsupport', {
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
      // 3. Verify if inputted lockerRoomID exists.
      await lockerRoomIDExists(lockerRoomID);
      // 4. Run findOneAndDelete to remove from UserRole.
      const group = (await LockerRoom.findById(lockerRoomID).exec())?.group;
      const userID = customClaims.app.userID;
      const result = await UserRole.findOneAndDelete({group, userID, uid, role: 'supporter'}).exec();

      if (result) {
        // 5. Decrement the UserAggregate (supports) of the User performing the action.
        // 6. Decrement the GroupAggregate (supporters) of the locker room that the user supported.
        // 7. Then, decrement the GroupAggregate (supporters) of the club/league that the user supported.
        // 8. Then, decrement the GroupAggregate (supporters) of the sports that the user supported.
        // 9. Lastly, decrement the GroupAggregate (supporters) of the league where the club is under.
        await incrementGroupAggregates('supporters', -1, {
          userID,
          lockerRoomID,
          group,
        });
      }
      return new MutationResult('Unsupport', group!.split(':')[1]);
    },
  });
});
