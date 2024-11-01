import {Sport} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (ids: string[]) {
  let exists;
  for (const id of ids) {
    exists = await Sport.findById(id).exec();
    if (!exists) {
      throw new UserInputError(`Sport ID does not exist. Input: ${id}`);
    }
  }
  return exists;
}
