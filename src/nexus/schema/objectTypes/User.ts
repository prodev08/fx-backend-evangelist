import {objectType} from 'nexus';
import isBlocked from '../../../app/checker/isBlocked';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('username');
    t.nonNull.string('slug');
    t.nonNull.string('uid');
    t.string('firstName');
    t.string('lastName');
    t.nonNull.string('emailAddress');
    t.field('Avatar', {type: 'Media'});
    t.boolean('online');

    // dynamic
    t.nonNull.string('name', {
      resolve: async ({firstName, lastName, username}) => {
        return firstName && lastName ? `${firstName} ${lastName}` : username;
      },
    });
    t.boolean('isBlocked', {
      resolve: async ({id: targetUserID}, args, {userID: actorUserID}) => {
        return await isBlocked(actorUserID, targetUserID);
      },
    });
  },
});
