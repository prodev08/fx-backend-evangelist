import {User} from 'lib-mongoose';
import * as admin from 'firebase-admin';

export default async function (uid: string) {
  const currentUser = await User.findOne({uid}).exec();
  await admin.auth().updateUser(uid, {
    displayName:
      currentUser!.firstName && currentUser!.lastName
        ? `${currentUser?.firstName} ${currentUser?.lastName}`
        : 'FX1 User',
  });
}
