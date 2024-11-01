import {nonNull, queryField, stringArg} from 'nexus';
import {User, UserRole, UserRoleDocument} from 'lib-mongoose';
import {userFilter} from '../../../utilities';
import getZipCode from '../../../app/getter/getZipCode';

export const UserQuery = queryField(t => {
  t.field('getUser', {
    type: 'User',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}, {loaders}) => {
      if (id) {
        return (await loaders?.findUserByID.load(id)) || null;
      }
      if (slug) {
        return (await loaders?.findUserBySlug.load(slug)) || null;
      }
      return null;
    },
  });
  t.nonNull.field('getUsers', {
    type: 'Users',
    resolve: async () => {
      const items = await User.find(userFilter).exec();
      return {
        count: items.length,
        items: items,
      };
    },
  });
  t.boolean('userNameExists', {
    args: {
      username: nonNull(stringArg()),
    },
    resolve: async (source, {username}) => {
      username = username.toLowerCase();
      const items = await User.findOne({username}).exec();
      return !!items;
    },
  });
  t.nonNull.field('getUsersByLockerRoom', {
    type: 'Users',
    args: {
      lockerRoomID: nonNull(stringArg()),
      text: stringArg(),
    },
    resolve: async (source, {lockerRoomID, text}) => {
      const pipeline = [
        {
          $match: {
            lockerRoomID,
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'uid',
            foreignField: 'uid',
            as: 'User',
          },
        },
        {
          $addFields: {
            username: {$arrayElemAt: ['$User.username', 0]},
          },
        },
        {
          $match: {
            $or: [{username: {$regex: new RegExp(`(${text})`), $options: 'i'}}],
          },
        },
      ];
      const uids = (await UserRole.aggregate(pipeline).exec()).map((item: UserRoleDocument) => {
        return item.uid;
      });
      const items = await User.find({uid: {$in: uids}}).exec();
      return {
        count: items.length,
        items: items,
      };
    },
  });
  t.nonNull.field('getAllUsersViaUsername', {
    type: 'Users',
    args: {
      text: stringArg(),
    },
    resolve: async (source, {text}) => {
      const pipeline = [
        {
          $lookup: {
            from: 'User',
            localField: 'uid',
            foreignField: 'uid',
            as: 'User',
          },
        },
        {
          $addFields: {
            id: {$toString: '$_id'},
            username: {$arrayElemAt: ['$User.username', 0]},
          },
        },
        {
          $match: {
            $or: [{username: {$regex: new RegExp(`(${text})`), $options: 'i'}}],
          },
        },
      ];
      const items = await User.aggregate(pipeline).exec();
      return {
        count: items.length,
        items: items,
      };
    },
  });
  t.field('getZipCode', {
    type: 'ZipCode',
    args: {
      zipCode: stringArg(),
    },
    resolve: async (source, {zipCode}) => {
      if (!zipCode) {
        return null;
      }
      return await getZipCode(zipCode);
    },
  });
});
