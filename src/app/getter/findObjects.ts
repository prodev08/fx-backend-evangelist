import {Club, League, FanGroup, Sport, LockerRoom, ChannelGroup, Channel, User} from 'lib-mongoose';
import {Model} from 'mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (objectType: string, additionalFilter: any = undefined, projection: any) {
  let model: typeof Model;
  let filter = {};
  switch (objectType) {
    case 'Sport': {
      model = Sport;
      filter = {...additionalFilter};
      break;
    }
    case 'LockerRoom': {
      model = LockerRoom;
      filter = {...additionalFilter};
      break;
    }
    case 'League': {
      model = League;
      filter = {...additionalFilter};
      break;
    }
    case 'Club': {
      model = Club;
      filter = {...additionalFilter};
      break;
    }
    case 'FanGroup': {
      model = FanGroup;
      filter = {isDeleted: false, ...additionalFilter};
      break;
    }
    case 'ChannelGroup': {
      model = ChannelGroup;
      filter = {isDeleted: false, ...additionalFilter};
      break;
    }
    case 'Channel': {
      model = Channel;
      filter = {isDeleted: false, ...additionalFilter};
      break;
    }
    case 'User': {
      model = User;
      break;
    }
    default: {
      throw new UserInputError(`${objectType} not found.`);
    }
  }
  return await model.find(filter, projection).exec();
}
