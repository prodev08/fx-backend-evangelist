import {Notification} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await Notification.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`Notification ID does not exist. Input: ${id}`);
  }
  return exists;
}
