import {booleanArg, list, nonNull, queryField, stringArg} from 'nexus';
import getDerivedPhotoURL from '../../../app/getter/getDerivedPhotoURL';
import {getPhotoURL} from '../objectTypes';

export const MediaQuery = queryField(t => {
  t.string('getPhotoURL', {
    args: {
      objectID: nonNull(stringArg()),
      objectType: nonNull(stringArg()),
      isSport: booleanArg(),
      type: stringArg(),
    },
    resolve: async (source, {objectID, objectType, isSport, type}) => {
      return getPhotoURL(objectID, objectType, isSport, type);
    },
  });
  t.list.string('getPhotoURLs', {
    args: {
      input: nonNull(list(nonNull('InputQueryMedia'))),
    },
    resolve: async (source, {input}) => {
      const result: any[] = [];
      for (const data of input) {
        const {objectID, objectType, isSport, type} = data;
        if (objectType !== 'Photo') {
          result.push(null);
        }
        if (isSport) {
          result.push(getDerivedPhotoURL(objectID, true));
        } else {
          result.push(getDerivedPhotoURL(objectID, false, type));
        }
      }
      return result;
    },
  });
});
