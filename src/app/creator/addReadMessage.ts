import {Message, ReadMessage} from 'lib-mongoose';
import requireLoggedIn from '../assertion/requireLoggedIn';
import requireHasUserAccount from '../assertion/requireHasUserAccount';
import channelSlugExists from '../checker/channelSlugExists';

export default async function (
  uid: string | null | undefined,
  channelSlug: string,
  verified = false,
  userId: string | null | undefined = null
) {
  let customClaims;
  if (!verified && !userId) {
    // 1. Require a logged in user.
    requireLoggedIn(uid);
    // 2. Require a user account.
    customClaims = await requireHasUserAccount(uid);
    // 3. Verify if inputted channelSlug exists.
    await channelSlugExists(channelSlug);
  }

  // 4. Retrieve last message from channel.
  const lastMessage = await Message.find({channelSlug}).sort({createdAt: -1}).limit(1).exec();
  // 5. Create entry in ReadMessage.
  if (lastMessage.length > 0) {
    const messageID = lastMessage[0].id;
    const chatID = lastMessage[0].chatID;
    const userID = userId || customClaims?.app.userID;
    return await ReadMessage.findOneAndUpdate(
      {channelSlug, userID},
      {messageID, chatID, uid},
      {upsert: true, new: true}
    ).exec();
  } else return null;
}
