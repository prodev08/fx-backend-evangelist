export {};

declare global {
  // eslint-disable-next-line no-var
  var appEnv: string;
  // eslint-disable-next-line no-var
  var googleServiceAccountBE: any;
  // eslint-disable-next-line no-var
  var firebaseBE: any;
  // eslint-disable-next-line no-var
  var storageBucketName: string;
  // eslint-disable-next-line no-var
  var baseURL: string;
  // eslint-disable-next-line no-var
  var sendGridAPIKey: string;
  // eslint-disable-next-line no-var
  var sentryDSN: string;
  // eslint-disable-next-line no-var
  var redisURL: any;
  // eslint-disable-next-line no-var
  var lockerRoomIDToDefaultSlug: any;
  // eslint-disable-next-line no-var
  var mixpanel: any;
  // eslint-disable-next-line no-var
  var defaultMaxChannelCount: any;
  // eslint-disable-next-line no-var
  var areYouWatchingThisURL: any;
  // eslint-disable-next-line no-var
  var areYouWatchingThisAPIKey: any;
}
