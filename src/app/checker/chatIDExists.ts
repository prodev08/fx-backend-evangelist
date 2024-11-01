import {Message} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (chatID: string) {
  const exists = await Message.findOne({chatID}).exec();
  if (!exists) {
    throw new UserInputError(`Chat ID does not exist. Input: ${chatID}`);
  }
  return exists;
}
