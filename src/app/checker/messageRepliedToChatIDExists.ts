import {Message} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (repliedToChatID: string) {
  const exists = await Message.findOne({chatID: repliedToChatID}).exec();
  if (!exists) {
    throw new UserInputError(`Chat ID does not exist. Input: ${repliedToChatID}`);
  }
  return exists;
}
