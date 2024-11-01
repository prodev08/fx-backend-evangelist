import {UserRole} from 'lib-mongoose';

export default async function (group: string, userID: string, action: string) {
  const userIsPrimaryOwner = await UserRole.findOne({group, userID, isPrimaryOwner: true}).exec();
  if (userIsPrimaryOwner) {
    // throw new Error(`Cannot update or remove access on locker room of primary owner. Input: ${action}`);
    console.log('isUserPrimaryOwner action', action);
    throw new Error("Sorry, the primary owner of a Locker Room can't be removed");
  }
}
