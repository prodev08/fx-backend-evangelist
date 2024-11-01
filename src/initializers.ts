import {connect, disconnect, Utilities} from 'lib-mongoose';
import './global';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import cronJobs from './app/cronJobs';

const Mixpanel = require('mixpanel');
global.appEnv = process.env.APP_ENV!.toString();

const {GOOGLE_APPLICATION_CREDENTIALS_BE: serviceAccountJSONBase64} = process.env;
const serviceAccountBuffer = serviceAccountJSONBase64 ? Buffer.from(serviceAccountJSONBase64, 'base64') : null;
global.googleServiceAccountBE = JSON.parse(serviceAccountBuffer!.toString());
global.firebaseBE = admin.initializeApp({credential: admin.credential.cert(global.googleServiceAccountBE)});

global.appEnv = process.env.APP_ENV!.toString();

global.storageBucketName = process.env.STORAGE_BUCKET_NAME!.toString();

global.baseURL = process.env.BASE_URL!.toString();

global.sendGridAPIKey = process.env.SENDGRID_API_KEY!.toString();

global.sentryDSN = process.env.SENTRY_DSN!.toString();

global.redisURL = process.env.REDIS_URL?.toString();

global.areYouWatchingThisURL = process.env.ARE_YOU_WATCHING_THIS_URL
  ? process.env.ARE_YOU_WATCHING_THIS_URL.toString()
  : 'https://fx1.api.areyouwatchingthis.com/api';

global.areYouWatchingThisAPIKey = process.env.ARE_YOU_WATCHING_THIS_API_KEY
  ? process.env.ARE_YOU_WATCHING_THIS_API_KEY.toString()
  : '6292075e70fd00967079a858e1f518ea';

// global.mixpanel = process.env.APP_ENV!.toString() === 'production' ? Mixpanel.init(process.env.MIXPANEL_TOKEN) : null;
global.mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);

connect().then(async () => {
  console.log('Connected to MongoDB!');
  global.defaultMaxChannelCount = (await Utilities.findOne({key: 'defaultMaxChannelCount'}).exec())?.value || 150;
  // global.lockerRoomIDToDefaultSlug = [];
  // (await LockerRoom.find().exec())?.map(async (lockerRoom: LockerRoomDocument) => {
  //   const lockerRoomID = lockerRoom.id.toString();
  //   const slug = await getDefaultChannelSlug(lockerRoomID);
  //   global.lockerRoomIDToDefaultSlug.push((global.lockerRoomIDToDefaultSlug[lockerRoomID] = slug));
  // });
  cronJobs();
});

function terminate() {
  disconnect().then();
}

process.on('SIGTERM', terminate);
process.on('SIGINT', terminate);
