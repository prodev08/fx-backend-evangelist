import {UserInputError} from 'apollo-server-express';

export default function (ids: string[]) {
  const length = ids.length;
  if (length > 1 || length === 0) {
    throw new UserInputError(`Sport ID length is invalid. Length: ${length}`);
  }
}
