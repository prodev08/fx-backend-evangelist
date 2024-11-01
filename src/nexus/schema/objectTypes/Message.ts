import {objectType} from 'nexus';
import {User, Message as MessageDB} from 'lib-mongoose';
import isBlocked from '../../../app/checker/isBlocked';
import {photoTypes} from '../../../utilities';
import {getPhotoURL} from './Media';

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('userID');
    t.nonNull.string('channelSlug');
    t.string('text');
    t.nonNull.string('chatID');
    t.string('repliedToChatID');
    t.list.nonNull.field('Media', {type: 'MediaMessage'});
    t.list.nonNull.field('PhotoURLs', {
      type: 'PhotoURL',
      resolve: async ({Media}) => {
        const result = [];
        if (Media !== null) {
          for (const media of Media!) {
            const {objectType, objectID} = media;
            for (const photoType of photoTypes) {
              result.push({type: photoType, photoURL: await getPhotoURL(objectID, objectType, false, photoType)});
            }
          }
        }
        return result;
      },
    });
    t.boolean('isDeletedSelf');
    t.boolean('isDeletedEveryone');
    t.boolean('isEdited');

    // dynamic
    t.field('User', {
      type: 'User',
      resolve: async ({userID}) => {
        return await User.findById(userID).exec();
      },
    });
    t.field('RepliedTo', {
      type: 'Message',
      resolve: async ({repliedToChatID}) => {
        return await MessageDB.findOne({chatID: repliedToChatID}).exec();
      },
    });
    t.boolean('isUserBlocked', {
      resolve: async ({userID: targetUserID}, args, {userID: actorUserID}) => {
        return await isBlocked(actorUserID, targetUserID);
      },
    });
  },
});
