import lockerRoomIDExists from '../checker/lockerRoomIDExists';
import {UserRole} from 'lib-mongoose';
import incrementGroupAggregates from './incrementGroupAggregates';
import getChannelSlugs from '../getter/getChannelSlugs';
import addReadMessage from './addReadMessage';

export default async function (
  lockerRoomID: string,
  userID: string | null | undefined,
  uid: string | null | undefined
) {
  // 1. Verify if inputted lockerRoomID exists.
  const group = (await lockerRoomIDExists(lockerRoomID))?.group;
  // 2 Check if currently an owner/manager/supporter to avoid replacing current role as all 3 are considered supporters.
  const [objectType, objectID] = group!.split(':');
  const role = 'supporter';
  const userRoleData = {
    group,
    groupType: objectType,
    groupID: objectID,
    userID,
    uid,
    role,
    status: 'active',
    lockerRoomID,
  };
  const userRoleExists = await UserRole.findOne({group, userID, uid}).exec();

  if (!userRoleExists) {
    // 3. Create if User Role does not exists.
    const result = await UserRole.create(userRoleData);
    if (result) {
      // 4. Then, increment the UserAggregate (supports) of the User performing the action.
      // 5. Then, increment the GroupAggregate (supporters) of the locker room that the user supported.
      // 6. Then, increment the GroupAggregate (supporters) of the club/league that the user supported.
      // 7. Then, increment the GroupAggregate (supporters) of the sports that the user supported.
      // 8. Then, increment the GroupAggregate (supporters) of the league where the club is under.
      await incrementGroupAggregates('supporters', 1, {
        userID,
        lockerRoomID,
        group,
      });
      // 9. Lastly, auto read all messages in lockerRoom.
      const channelSlugs = await getChannelSlugs(lockerRoomID);
      for (const channelSlug of channelSlugs) {
        await addReadMessage(uid, channelSlug, true, userID);
      }
    }
  }
  return objectID;
}
