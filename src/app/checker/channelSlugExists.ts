import {Channel} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';
import {channelFilter} from '../../utilities';

export default async function (slug: string) {
  const exists = await Channel.findOne({...channelFilter, slug}).exec();
  if (!exists) {
    // throw new UserInputError(`Channel Slug does not exist. Input: ${slug}`);
    throw new UserInputError(`Sorry, for some reason this channel can't be displayed ${slug}`);
  }
  return exists;
}
