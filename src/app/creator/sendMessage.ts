import {Message, User} from 'lib-mongoose';
import addReadMessage from './addReadMessage';
import isTextAndMediaNull from '../checker/isTextAndMediaNull';
import isMediaNotEmpty from '../checker/isMediaNotEmpty';
import addNotification from './addNotification';

export default async function (
  uid: string | null | undefined,
  userID: string,
  channelSlug: string,
  text: string | null | undefined,
  chatID: string,
  repliedToChatID?: string | null,
  Media?: {objectID: string; objectType: string}[] | null,
  MentionedUserIDs?: string[] | null
) {
  uid = uid ? uid : (await User.findById(userID).exec())?.uid;
  // Check if both text and/or Media are null.
  isTextAndMediaNull(text, Media);
  // Check if Media is not empty.
  await isMediaNotEmpty(Media);
  // Send Message
  const result = await Message.create({userID, channelSlug, text, chatID, repliedToChatID, Media});
  // Read Message to update latest message seen on channel
  await addReadMessage(uid, channelSlug);

  if (repliedToChatID || MentionedUserIDs) {
    await addNotification({
      repliedToChatID,
      MentionedUserIDs,
      actorUserID: userID,
      actorUid: uid!,
      messageID: result.id,
      chatID,
      channelSlug,
      text,
      Media,
    });
  }
  return result;
}
