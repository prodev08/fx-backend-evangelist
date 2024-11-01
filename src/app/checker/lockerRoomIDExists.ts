import {LockerRoom} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await LockerRoom.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`LockerRoom ID does not exist. Input: ${id}`);
  }
  return exists;
}
