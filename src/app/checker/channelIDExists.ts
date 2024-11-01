import {Channel} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';
import {channelFilter} from '../../utilities';
import stringToObjectId from '../transform/stringToObjectId';

export default async function (id: string, includeDeleted = false) {
  let filter: any = {...channelFilter, _id: stringToObjectId(id)};
  if (includeDeleted) {
    filter = {_id: stringToObjectId(id)};
  }
  const exists = await Channel.findOne(filter).exec();
  if (!exists) {
    // throw new UserInputError(`Channel ID does not exist. Input: ${id}`);
    throw new UserInputError(`Sorry, for some reason this channel can't be displayed ${id}`);
  }
  return exists;
}
