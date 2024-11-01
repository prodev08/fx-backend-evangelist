import {objectType, stringArg} from 'nexus';
import getDerivedPhotoURL from '../../../app/getter/getDerivedPhotoURL';

/*
 * There are 2 ways to upload a photo
 * 1. Via channelUploads/
 * 2. Via uploaded/
 */
export function getPhotoURL(objectID: string, objectType: string, isSport?: boolean | null, type?: string | null) {
  if (objectType !== 'Photo') return null;
  if (isSport) {
    return getDerivedPhotoURL(objectID, true);
  }
  return getDerivedPhotoURL(objectID, false, type);
}

export const Media = objectType({
  name: 'Media',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.boolean('isSport');
    t.string('PhotoURL', {
      args: {
        type: stringArg(),
      },
      resolve: async ({objectID, objectType, isSport}, {type}) => {
        return getPhotoURL(objectID, objectType, isSport, type);
      },
    });
  },
});

export const MediaMessage = objectType({
  name: 'MediaMessage',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.boolean('isSport', {resolve: () => false});
    t.string('PhotoURL', {
      args: {
        type: stringArg(),
      },
      resolve: async ({objectID, objectType}, {type}) => {
        return getPhotoURL(objectID, objectType, false, type || '1024');
      },
    });
  },
});
