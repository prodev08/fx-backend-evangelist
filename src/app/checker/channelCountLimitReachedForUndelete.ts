import {ForbiddenError} from 'apollo-server-express';
import {Channel} from 'lib-mongoose';
import channelCountLimitReached from './channelCountLimitReached';

export default async function (lockerRoomID: string, channelGroupID: string) {
  const current = await channelCountLimitReached(lockerRoomID);
  const channelCountOnceUndeleted = await Channel.countDocuments({channelGroupID, isDeleted: true});
  const length = current + channelCountOnceUndeleted;
  if (length > global.defaultMaxChannelCount) {
    throw new ForbiddenError('Max channel limit will be reached once undeleted.');
  }
  return length;
}
