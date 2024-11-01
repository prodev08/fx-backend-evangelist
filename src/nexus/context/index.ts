import {AuthenticationError, ExpressContext} from 'apollo-server-express';
import {auth} from 'lib-api-common';
import createDataLoaders from './createDataLoaders';
import {IAppResolverContext} from '../../interfaces';

export default async function (context: ExpressContext) {
  const {req} = context;

  let uid: string | null | undefined = null;
  let email: string | null | undefined = null;
  let userID: string | null | undefined = null;

  // Check Authentication
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const tokenResult = await auth.validateToken(token, global.firebaseBE);
      uid = tokenResult.uid!;
      email = tokenResult.email!;
      userID = tokenResult.userID;
    } catch (e) {
      throw new AuthenticationError('Invalid token.');
    }
  }

  // const platform = req.header('X-FX1-Device-Platform');
  // const webDisplaySize = req.header('X-FX1-Web-Display-Size');
  // const pageName = req.header('X-FX1-Page-Name');
  const ip = req.headers['x-forwarded-for'];

  const contextObject: IAppResolverContext = {
    uid,
    email,
    userID,
    ip: ip ? ip!.toString()!.split(',')[0] : null,
    // platform,
    // webDisplaySize,
    // pageName,
    loaders: createDataLoaders(),
  };
  return contextObject;
}
