import {UserInputError} from 'apollo-server-express';

export default function (type?: string | null, groupType?: string | null) {
  if (type === 'Private' && groupType !== 'Game') {
    throw new UserInputError('We cannot create a Private Group for this Group Type');
  }
}
