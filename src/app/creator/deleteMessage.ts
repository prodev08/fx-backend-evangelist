import requireLoggedIn from '../assertion/requireLoggedIn';
import requireHasUserAccount from '../assertion/requireHasUserAccount';
import chatIDExists from '../checker/chatIDExists';
import {Message} from 'lib-mongoose';
import {MutationResult} from 'lib-api-common';

export default async function (
  chatID: string,
  deleteForSelf: boolean,
  deleteForEveryone: boolean,
  uid: string | null | undefined
) {
  // 1. Require a logged in user.
  requireLoggedIn(uid);
  // 2. Require a user account.
  const customClaims = await requireHasUserAccount(uid);
  // 3. Verify if inputted chatID exists.
  await chatIDExists(chatID);
  // 4. Check if one is set to true.
  if (deleteForSelf === false && deleteForEveryone === false) {
    throw new Error('Should set either deleteForSelf or deleteForEveryone to true');
  }
  // 5. Check if both is set to true.
  if (deleteForSelf === true && deleteForEveryone === true) {
    throw new Error('Should set either deleteForSelf or deleteForEveryone to false');
  }
  // 6. Get last message prior to the deleted message.
  // const lastMessage = (await Message.find({$and: [{channelSlug}, {_id: {$lt: id}}]}).exec())[0];
  // 6. Re-set deleteForSelf and deleteForEveryone.
  const userID = customClaims.app.userID;
  const result = await Message.findOneAndUpdate(
    {chatID, userID},
    {isDeletedSelf: deleteForSelf, isDeletedEveryone: deleteForEveryone}
  ).exec();
  // if (result) {
  // 7. Re-adjust last read message of users whose last read message is the deleted one.
  // if (lastMessage) {
  //   const {id: lastMessageID, chatID: lastChatID} = lastMessage;
  //   await ReadMessage.updateMany({chatID}, {messageID: lastMessageID, chatID: lastChatID});
  // } else {
  //   await ReadMessage.deleteMany({chatID});
  // }
  // }
  return new MutationResult('Message', result?.id);
}
