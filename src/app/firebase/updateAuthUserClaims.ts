import * as admin from 'firebase-admin';

export default async function (uid: string, userID: string) {
  await admin.auth().setCustomUserClaims(uid, {app: {userID: userID}});
}
