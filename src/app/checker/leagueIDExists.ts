import {League} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await League.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`League ID does not exist. Input: ${id}`);
  }
  return exists;
}
