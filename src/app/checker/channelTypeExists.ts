import {UserInputError} from 'apollo-server-express';

const availableChannelType: string[] = ['Private', 'Public'];
export default function (type: string) {
  if (!availableChannelType.includes(type)) {
    // throw new UserInputError(`Channel Type does not exist. Input: ${type}`);
    throw new UserInputError(`Sorry, for some reason this channel can't be displayed ${type}`);
  }
}
