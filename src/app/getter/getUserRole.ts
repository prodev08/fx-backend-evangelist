import {UserRole} from 'lib-mongoose';

export default async function (group: string, userID: string) {
  return await UserRole.findOne({
    $and: [{group, userID, status: 'active'}, {$or: [{role: 'owner'}, {role: 'manager'}]}],
  }).exec();
}
