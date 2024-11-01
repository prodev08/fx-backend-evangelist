import {UserRole} from 'lib-mongoose';
import {ForbiddenError} from 'apollo-server-express';

export default async function (group: string, userID: string, action: string) {
  const role = await UserRole.findOne({
    $and: [{group, userID, status: 'active'}, {$or: [{role: 'owner'}, {role: 'manager'}]}],
  }).exec();
  if (!role) {
    // throw new ForbiddenError(`Action out of scope. You should either be an owner or manager. Input: ${action}`);
    console.log('isUserOwnerOrManager action', action);
    throw new ForbiddenError('Sorry, this action requires owner or management level access');
  }
  return role;
}
