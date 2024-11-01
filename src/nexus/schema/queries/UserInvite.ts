import {nonNull, queryField, stringArg} from 'nexus';
import {UserInvites} from 'lib-mongoose';
import {ForbiddenError} from 'apollo-server-express';

export const UserInviteQuery = queryField(t => {
  t.field('getUserInvite', {
    type: 'UserInvite',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = (await UserInvites.findById(id).exec()) || null;
      if (result) {
        const now = new Date().getTime();
        if (now > result.expiration) {
          throw new ForbiddenError('Link expired. Ask inviter to resend the invitation.');
        }
      }
      return result;
    },
  });
});
