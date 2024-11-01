import {ChannelGroup} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';
import {channelGroupFilter} from '../../utilities';
import stringToObjectId from '../transform/stringToObjectId';

export default async function (id: string, includeDeleted = false) {
  let filter: any = {...channelGroupFilter, _id: stringToObjectId(id)};
  if (includeDeleted) {
    filter = {_id: stringToObjectId(id)};
  }
  const exists = await ChannelGroup.findOne(filter).exec();
  if (!exists) {
    //throw new UserInputError(`Channel Group ID does not exist. Input: ${id}`);
    throw new UserInputError(`Sorry, for some reason this channel can't be displayed ${id}`);
  }
  return exists;
}
