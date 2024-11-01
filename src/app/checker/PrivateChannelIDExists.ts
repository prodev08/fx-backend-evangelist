import {Channel} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await Channel.findOne({_id: id, type: 'Private'}).exec();
  if (!exists) {
    throw new UserInputError(`Private Channel ID does not exist. Input: ${id}`);
  }
  return exists;
}
