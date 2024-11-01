import {UserInputError} from 'apollo-server-express';
import {InputMedia} from './isMediaNotEmpty';

export default function (text?: string | null, Media?: InputMedia[] | null) {
  if (!text && !Media) {
    throw new UserInputError('Text and Media cannot be empty.');
  }
}
