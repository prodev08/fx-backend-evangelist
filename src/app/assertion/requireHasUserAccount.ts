import * as admin from 'firebase-admin';
import {AuthenticationError} from 'apollo-server-express';

export default async function (uid?: string | null) {
  const customClaims = (await admin.auth().getUser(uid!))?.customClaims;
  if (!(customClaims !== undefined && customClaims !== null)) {
    // throw new AuthenticationError('You must create an account.');
    throw new AuthenticationError('Sorry, you must be logged in to take this action');
  }
  return customClaims;
}
