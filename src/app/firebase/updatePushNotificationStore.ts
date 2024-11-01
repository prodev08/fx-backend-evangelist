// import {firestore} from 'firebase-admin';

// const notificationCollection = 'push_notification';

// export const setPushNotification = async (data: any) => {
//   await firestore().collection(notificationCollection).add(data);
// };

// export const unsetPushNotification = async (userID: string, gameID: string) => {
//   const query = firestore().collection(notificationCollection).where('userID', '==', userID).where('gameID', '==', gameID);
//   const doc = await query.get();

//   doc.forEach(async snapshot => {
//     await firestore().collection(notificationCollection).doc(snapshot.id).delete();
//   });
// };
