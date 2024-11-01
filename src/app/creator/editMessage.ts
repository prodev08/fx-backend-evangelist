import requireLoggedIn from '../assertion/requireLoggedIn';
import requireHasUserAccount from '../assertion/requireHasUserAccount';
import chatIDExists from '../checker/chatIDExists';
import isTextAndMediaNull from '../checker/isTextAndMediaNull';
import isMediaNotEmpty from '../checker/isMediaNotEmpty';
import {Message} from 'lib-mongoose';
import {MutationResult} from 'lib-api-common';
import addNotification from './addNotification';

export default async function (
  chatID: string,
  text: string | null | undefined,
  repliedToChatID: string | null | undefined,
  Media: any,
  uid: string | null | undefined,
  MentionedUserIDs: string[] | null | undefined
) {
  // 1. Require a logged in user.
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);
  // 3. Verify if inputted chatID exists.
  await chatIDExists(chatID);
  // 4. Check if both text and/or Media are null.
  isTextAndMediaNull(text, Media);
  // 5. Check if Media is not empty.
  await isMediaNotEmpty(Media);
  // 6. Edit message.
  const userID = customClaims.app.userID;
  const result = await Message.findOneAndUpdate(
    {chatID, userID},
    {text, repliedToChatID, Media, isEdited: true, updatedAt: new Date().getTime()}
  ).exec();

  if (MentionedUserIDs && result) {
    await addNotification({
      repliedToChatID,
      MentionedUserIDs,
      actorUserID: userID,
      actorUid: uid!,
      messageID: result.id,
      chatID,
      channelSlug: result.channelSlug,
      text,
      Media,
    });
  }

  return new MutationResult('Message', result?.id);
}
