import {nonNull, queryField, stringArg} from 'nexus';
import {Channel, UserInvites} from 'lib-mongoose';
import {channelFilter} from '../../../utilities';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import requireLoggedIn from '../../../app/assertion/requireLoggedIn';
import requireHasUserAccount from '../../../app/assertion/requireHasUserAccount';
import gameIDExists from '../../../app/checker/gameIDExists';
import {createDynamicUrl} from '../../../dynamicLink';
import PrivateChannelIDExists from '../../../app/checker/PrivateChannelIDExists';

interface ICreateAcutalInviteLink {
  uid?: string | null;
  userID?: string | null;
  privateChannelID: string;
  gameID: string;
}

const createActualInviteLink = async (param: ICreateAcutalInviteLink): Promise<string> => {
  const {uid, userID, privateChannelID, gameID} = param;
  // 1. Require a user logged in.
  requireLoggedIn(uid);
  // 2. Require a user account.
  await requireHasUserAccount(uid);
  // 3. Verify if inputted privatechannel exists.
  await PrivateChannelIDExists(privateChannelID);
  // 4. Verify if inputted game exists.
  await gameIDExists(gameID);
  // 5. Create user invitation
  const invite = await UserInvites.create({
    group: `Channel:${privateChannelID}`,
    type: 'InviteToPrivateChannel',
    expiration: new Date().getTime() + 24 * 3600000, // 1d
    data: {gameID},
    userID,
  });
  // 6. Generate a invite url
  invite.url = `${process.env.BASE_URL}/user/invite?accept=${invite.id}`;
  await invite.save();
  return invite.url;
};

export const ChannelQuery = queryField(t => {
  t.field('getChannel', {
    type: 'Channel',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        const channelID = stringToObjectId(id);
        return await Channel.findOne({...channelFilter, _id: channelID}).exec();
      }
      return await Channel.findOne({...channelFilter, slug}).exec();
    },
  });
  t.nonNull.field('getChannels', {
    type: 'Channels',
    args: {
      channelGroupID: stringArg(),
    },
    resolve: async (source, {channelGroupID}) => {
      let items;
      items = await Channel.find(channelFilter).exec();
      if (channelGroupID) {
        items = await Channel.find({...channelFilter, channelGroupID}).exec();
      }
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });

  t.boolean('channelExists', {
    args: {
      name: nonNull(stringArg()),
      channelGroupID: nonNull(stringArg()),
    },
    resolve: async (source, {name, channelGroupID}) => {
      const items = await Channel.findOne({...channelFilter, name, channelGroupID}).exec();
      return !!items;
    },
  });
  t.nonNull.string('getActualEventInviteLink', {
    args: {
      privateChannelID: nonNull(stringArg()),
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, gameID}, {uid, userID}) => {
      const actualLink = await createActualInviteLink({uid, userID, privateChannelID, gameID});
      return actualLink;
    },
  });
  t.nonNull.string('getDynamicEventInviteLink', {
    args: {
      privateChannelID: nonNull(stringArg()),
      gameID: nonNull(stringArg()),
    },
    resolve: async (source, {privateChannelID, gameID}, {uid, userID}) => {
      const actualLink = await createActualInviteLink({uid, userID, privateChannelID, gameID});
      const dynamicLink = await createDynamicUrl(actualLink);
      return dynamicLink;
    },
  });
});
