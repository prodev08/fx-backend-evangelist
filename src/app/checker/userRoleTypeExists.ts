import {UserRoleType, UserRoleTypeDocument} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const ids = (await UserRoleType.find().exec()).map((item: UserRoleTypeDocument) => item.id);
  if (!ids.includes(id)) {
    throw new UserInputError(`UserRoleType does not exist. Input: ${id}`);
  }
}
