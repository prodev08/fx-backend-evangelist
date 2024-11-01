import {objectType} from 'nexus';
import * as admin from 'firebase-admin';
import getSupportedLockerRooms from '../../../app/getter/getSupportedLockerRooms';
import {Notification} from 'lib-mongoose';
import getZipCode from '../../../app/getter/getZipCode';

export const Me = objectType({
  name: 'Me',
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
    t.string('zipCode');
    t.field('Avatar', {type: 'Media'});

    // dynamic
    t.nonNull.string('name', {
      resolve: async ({uid}) => {
        const result = await admin.auth().getUser(uid);
        return result.displayName!;
      },
    });
    t.list.nonNull.field('Supporting', {
      type: 'LockerRoom',
      resolve: async ({uid}) => {
        // sorted by updatedAt of User Role
        return await getSupportedLockerRooms(uid);
      },
    });
    t.nonNull.int('unseenNotifications', {
      resolve: async ({uid: targetUid}) => {
        const notification = await Notification.find({targetUid, isSeen: false}).exec();
        return notification ? notification.length : 0;
      },
    });
    t.field('ZipCode', {
      type: 'ZipCode',
      resolve: async ({zipCode}) => {
        if (!zipCode) {
          return null;
        }
        return await getZipCode(zipCode);
      },
    });
  },
});
