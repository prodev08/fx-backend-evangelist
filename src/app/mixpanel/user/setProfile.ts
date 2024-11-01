import {IAppResolverContext} from '../../../interfaces';
import {AuthenticationError} from 'apollo-server-express';
import getDerivedPhotoURL from '../../getter/getDerivedPhotoURL';

interface ISetProfile {
  username: string;
  emailAddress: string;
  ip?: string | null;
  avatarObjectID?: string | null;
}

export default async function (data: ISetProfile, context: IAppResolverContext) {
  const {uid: distinct_id, ip: ipAddress} = context;
  if (!distinct_id) {
    throw new AuthenticationError('Distinct ID is empty.');
  }
  const {username: Username, emailAddress, avatarObjectID, ip} = data;
  const avatar = avatarObjectID ? await getDerivedPhotoURL(avatarObjectID) : null;
  await mixpanel.people.set(distinct_id!, {
    Username,
    $email: emailAddress,
    $avatar: avatar,
    ip: ip || ipAddress,
    'Locker Rooms Supported': 0,
    'Messages Sent': 0,
  });
}
