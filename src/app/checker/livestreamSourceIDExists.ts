import {LivestreamSource} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await LivestreamSource.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`Livestream source ID does not exist. Input: ${id}`);
  }
  return exists;
}
