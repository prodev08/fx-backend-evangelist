import {Club} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await Club.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`Club ID does not exist. Input: ${id}`);
  }
  return exists;
}
