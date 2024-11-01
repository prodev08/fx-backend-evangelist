import {booleanArg, list, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import channelSlugExists from '../../../app/checker/channelSlugExists';
import sendMessage from '../../../app/creator/sendMessage';
import * as admin from 'firebase-admin';
import {Logs} from 'lib-mongoose';
import {photoTypes} from '../../../utilities';
import editMessage from '../../../app/creator/editMessage';
import deleteMessage from '../../../app/creator/deleteMessage';

/*
sendMessage Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted channelSlug exists.
4. Check if both text and/or Media are nul
5. Check if Media is not empty.
6. Create message.
7. Read Message to update latest message seen on channel.
todo: Will add additional rules once finalized.
:Supporters are only the people that can send a message.

editMessage Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted chatID exists.
4. Check if both text and/or Media are null
5. Check if Media is not empty.
6. Edit message.

deleteMessage Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted chatID exists.
4. Check if one is set to true.
5. Check if both is set to true.
6. Re-set deleteForSelf and deleteForEveryone.

deleteImages Mutation

 */

export const MessageMutations = mutationField(t => {
  t.nonNull.field('sendMessage', {
    type: 'MutationResult',
    args: {
      channelSlug: nonNull(stringArg()),
      text: stringArg(),
      chatID: nonNull(stringArg()),
      repliedToChatID: stringArg(),
      Media: list(nonNull('InputMedia')),
      MentionedUserIDs: list(nonNull(stringArg())),
    },
    resolve: async (source, {channelSlug, text, chatID, repliedToChatID, Media, MentionedUserIDs}, context) => {
      const {uid} = context;
      // 1. Require a logged in user.
      requireLoggedIn(uid);
      // 2. Require a user account.
      const customClaims = await requireHasUserAccount(uid);
      // 3. Verify if inputted channelSlug exists.
      await channelSlugExists(channelSlug);
      // 4. Check if both text and/or Media are null.
      // 5. Check if Media is not empty.
      // 6. Create message.
      // 7. Read Message to update latest message seen on channel.
      const userID = customClaims.app.userID;
      const result = await sendMessage(
        uid,
        userID,
        channelSlug,
        text,
        chatID,
        repliedToChatID,
        Media,
        MentionedUserIDs
      );
      return new MutationResult('Message', result.id);
    },
  });
  t.nonNull.field('editMessage', {
    type: 'MutationResult',
    args: {
      chatID: nonNull(stringArg()),
      text: stringArg(),
      repliedToChatID: stringArg(),
      Media: list(nonNull('InputMedia')),
      MentionedUserIDs: list(nonNull(stringArg())),
    },
    resolve: async (source, {chatID, text, repliedToChatID, Media, MentionedUserIDs}, context) => {
      const {uid} = context;
      return await editMessage(chatID, text, repliedToChatID, Media, uid, MentionedUserIDs);
    },
  });
  t.nonNull.field('deleteMessage', {
    type: 'MutationResult',
    args: {
      chatID: nonNull(stringArg()),
      deleteForSelf: nonNull(booleanArg()),
      deleteForEveryone: nonNull(booleanArg()),
    },
    resolve: async (source, {chatID, deleteForSelf, deleteForEveryone}, context) => {
      const {uid} = context;
      return await deleteMessage(chatID, deleteForSelf, deleteForEveryone, uid);
    },
  });
  t.nonNull.field('deleteImages', {
    type: 'MutationResult',
    args: {
      objectIDs: nonNull(list(nonNull(stringArg()))),
    },
    resolve: async (source, {objectIDs}) => {
      for (const objectID of objectIDs) {
        const bucket = admin.storage().bucket(global.storageBucketName);
        for (const photoType of photoTypes) {
          let logs;
          const name = `photos/${objectID}-${photoType}.webp`;
          const file = bucket.file(name);
          await file
            .delete()
            .then(async (response: any) => {
              console.log('Successfully deleted photo.');
              logs = {
                responseCode: response[0].statusCode,
                responseMessage: response[0].statusMessage,
                requestHeaders: response[0].headers,
                status: 'successful',
              };
            })
            .catch((response: any) => {
              console.log(`Failed to remove photo, error: ${response.errors[0].message}`);
              logs = {
                responseCode: response.code,
                responseMessage: response.errors[0].message,
                requestHeaders: response.response.headers,
                status: 'failed',
              };
            });
          await Logs.create({
            type: 'Delete Image via deleteImages API',
            logs,
          });
        }
      }
      return new MutationResult('Message');
    },
  });
});
