import {UserRole} from 'lib-mongoose';
import {IUserRole} from '../../interfaces/IUserRole';

export default async function (userRole: IUserRole) {
  return await UserRole.create(userRole);
}
