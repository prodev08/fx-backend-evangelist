import userInviteIDExists from './userInviteIDExists';
import {ForbiddenError} from 'apollo-server-express';

export default async function (id: string, emailAddress: string) {
  const userInviteEntry = await userInviteIDExists(id);
  if (userInviteEntry.data.emailAddress !== emailAddress) {
    throw new ForbiddenError('Action out of scope. You should be invited. Email incorrect.');
  }
}
