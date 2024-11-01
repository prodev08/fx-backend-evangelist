import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import addReadMessage from '../../../app/creator/addReadMessage';

/*
readMessage Mutation
1. Require a logged in user.
2. Require a user account.
3. Verify if inputted channelSlug exists.
4. Retrieve last message from channel.
5. Create entry in ReadMessage.
 */

export const ReadMessageMutations = mutationField(t => {
  t.nonNull.field('readMessage', {
    type: 'MutationResult',
    args: {
      channelSlug: nonNull(stringArg()),
    },
    resolve: async (source, {channelSlug}, context) => {
      const {uid} = context;
      const result = await addReadMessage(uid, channelSlug);
      return new MutationResult('ReadMessage', result?.id);
    },
  });
});
