import {Message} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await Message.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`Message ID does not exist. Input: ${id}`);
  }
  return exists;
}
