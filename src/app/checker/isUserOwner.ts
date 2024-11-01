import {UserRole} from 'lib-mongoose';

export default async function (group: string, userID: string, action: string) {
  const role = await UserRole.find({group, userID, status: 'active', role: 'owner'}).exec();
  if (role.length === 0) {
    throw new Error(`Action out of scope. You should be an owner. Input: ${action}`);
  }
}
