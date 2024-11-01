import {Game} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (gameID: string) {
  const exists = await Game.findOne({gameID}).exec();
  if (!exists) {
    throw new UserInputError(`Game does not exist. Input: ${gameID}`);
  }
  return exists;
}
