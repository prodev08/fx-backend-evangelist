import {Livestream} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await Livestream.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`Livestream ID does not exist. Input: ${id}`);
  }
  return exists;
}
