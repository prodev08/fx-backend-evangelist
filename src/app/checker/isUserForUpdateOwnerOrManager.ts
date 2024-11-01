import {UserRole} from 'lib-mongoose';
import {ForbiddenError} from 'apollo-server-express';

export default async function (group: string, userID: string, action: string) {
  const role = await UserRole.find({
    $and: [{group, userID, status: 'active'}, {$or: [{role: 'owner'}, {role: 'manager'}]}],
  }).exec();
  if (role.length === 0) {
    throw new ForbiddenError(
      `Action out of scope. User for update should either be an owner or manager. Input: ${action}`
    );
  }
}
