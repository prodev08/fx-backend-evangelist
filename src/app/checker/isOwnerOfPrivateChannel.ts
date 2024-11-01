import {UserInputError} from 'apollo-server-express';
import {UserRole} from 'lib-mongoose';

export default async function (privateChannelID?: string | null, uid?: string | null) {
  const owner = await UserRole.findOne({groupType: 'Channel', groupID: privateChannelID, role: 'owner'});
  if (owner && owner?.uid === uid) return owner;
  throw new UserInputError('You should be an owner of this channel to take this action.');
}
