import {ForbiddenError} from 'apollo-server-express';
import getChannelSlugs from '../getter/getChannelSlugs';

export default async function (lockerRoomID: string) {
  const length = (await getChannelSlugs(lockerRoomID)).length;
  if (length >= global.defaultMaxChannelCount) {
    //throw new ForbiddenError('Max channel limit reached.');
    throw new ForbiddenError('Sorry, you have reached the max number of channels you can create');
  }
  return length;
}
