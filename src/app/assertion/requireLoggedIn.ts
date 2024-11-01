import {AuthenticationError} from 'apollo-server-express';
import isUserLoggedIn from '../checker/isUserLoggedIn';

export default function (uid?: string | null) {
  if (!isUserLoggedIn(uid)) {
    // throw new AuthenticationError('You must be logged in.');
    throw new AuthenticationError('Sorry, you must be logged in to take this action');
  }
}
