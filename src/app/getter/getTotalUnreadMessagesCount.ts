import getChannelSlugs from './getChannelSlugs';
import getUnreadMessagesCount from './getUnreadMessagesCount';

export default async function (uid: string, lockerRoomID: string) {
  const channelSlugs = await getChannelSlugs(lockerRoomID);
  let length = 0;
  for (const channelSlug of channelSlugs) {
    length += await getUnreadMessagesCount(uid, channelSlug);
  }
  return length;
}
