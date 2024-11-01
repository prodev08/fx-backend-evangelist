import * as admin from 'firebase-admin';
import createFCMTitleAndBody, {createReminderPushNoficationTitleAndBody} from './createFCMTitleAndBody';

function sendMessage(topic: string, notification: any, data: any, options: any) {
  return admin.messaging().send({
    topic,
    notification: {
      ...notification,
      title: notification.title || 'FX1 Notification',
      body: notification.body || '',
    },
    data: {
      ...data,
      time: new Date().toISOString(),
    },
    ...options,
  });
}

export default async function (topic: string, data: any) {
  const {actorUserID, channelSlug, type, text, Media} = data;
  const {title, body, photoURL, redirect} = await createFCMTitleAndBody(actorUserID, channelSlug, type, text, Media);
  data.Media = '';
  return sendMessage(
    topic,
    {
      title,
      body,
      imageUrl: photoURL!,
    },
    {
      ...data,
      redirect,
    },
    defaultAppPushOptions
  );
}

export const sendReminderPushNotification = async (topic: string, data: any) => {
  const {title, body, redirect, group} = await createReminderPushNoficationTitleAndBody(data.gameID);
  return sendMessage(
    topic,
    {
      title,
      body,
    },
    {
      ...data,
      redirect,
      group,
      type: 'EventReminder',
    },
    defaultAppPushOptions
  );
};

export const defaultAppPushOptions = {
  android: {
    notification: {
      clickAction: 'NEW_PUSH_NOTIFICATION',
      // imageUrl: photoURLNotif || undefined,
      // icon: photoURLNotif || undefined,
    },
  },
  apns: {
    payload: {
      aps: {
        'mutable-content': 1,
      },
    },
    // fcm_options: {
    //   image: photoURLNotif || undefined,
    // },
  },
  // webpush: {
  //   // headers: {
  //   //   image: photoURLNotif || undefined,
  //   // },
  //   notification: {
  //     image: photoURLNotif || undefined,
  //   },
  // },
};

// export const defaultAppPushOptions = {
//   android: {
//     notification: {
//       clickAction: 'NEW_PUSH_NOTIFICATION',
//     },
//   },
//   apns: {
//     payload: {
//       aps: {
//         mutableContent: true,
//       },
//     },
//   },
// };
