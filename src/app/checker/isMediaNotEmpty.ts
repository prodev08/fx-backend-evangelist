import {UserInputError} from 'apollo-server-express';

export interface InputMedia {
  objectID: string;
  objectType: string;
}

export default async function (Media?: InputMedia[] | null) {
  if (Media) {
    if (Media.length === 0) {
      throw new UserInputError('Media cannot be empty.');
    }
  }
}
