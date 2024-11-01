import {Club, FanGroup, InHouse, League, Game} from 'lib-mongoose';
import {Model} from 'mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (objectType: string, objectID: string, projection: any) {
  // const model: typeof Model = objectType === 'Club' ? Club : objectType === 'League' ? League : FanGroup;
  let model: typeof Model;
  switch (true) {
    case objectType === 'Club': {
      model = Club;
      break;
    }
    case objectType === 'League': {
      model = League;
      break;
    }
    case objectType === 'FanGroup': {
      model = FanGroup;
      break;
    }
    case objectType === 'InHouse': {
      model = InHouse;
      break;
    }
    case objectType === 'Game': {
      model = Game;
      break;
    }
    default: {
      throw new UserInputError(`${objectType} type not found.`);
    }
  }
  let result;
  if (objectType === 'Game') {
    result = await model.findOne({gameID: objectID}, projection).exec();
  } else {
    result = await model.findById(objectID, projection).exec();
  }

  if (!result) {
    throw new UserInputError(`${objectType} not found.`);
  }
  return result;
}
