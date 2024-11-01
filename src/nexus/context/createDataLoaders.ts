import _ from 'lodash';
// eslint-disable-next-line node/no-extraneous-import
import DataLoader from 'dataloader';
import {Document, Model} from 'mongoose';
import {
  Channel,
  ChannelGroup,
  Club,
  FanGroup,
  GroupAggregates,
  InHouse,
  League,
  LockerRoom,
  Sport,
  User,
} from 'lib-mongoose';
import {IDataLoaders} from '../../interfaces';

function getMongooseIDLoader<T extends Document>(model: Model<T>, projection?: any) {
  return new DataLoader(async keys => {
    const ids = _.uniq(_.compact(keys.map(x => (<any>x).toString())));
    const result = await model.find({_id: {$in: ids}}, projection).exec();
    return keys.map(x => _.find(result, y => (<any>x).toString() === y.id));
  });
}

function getMongooseSlugLoader<T extends Document & {slug?: string | null}>(model: Model<T>, projection?: any) {
  return new DataLoader(async keys => {
    const slugs = _.uniq(_.compact(keys)) as string[];
    const result = await model.find(<any>{slug: {$in: slugs}}, projection).exec();
    return keys.map(x => _.find(result, y => x === y.slug));
  });
}

function getMongooseGroupLoader<T extends Document & {group?: string | null}>(model: Model<T>, projection?: any) {
  return new DataLoader(async keys => {
    const groups = _.uniq(_.compact(keys)) as string[];
    const result = await model.find(<any>{group: {$in: groups}}, projection).exec();
    return keys.map(x => _.find(result, y => x === y.group));
  });
}

export default function (): IDataLoaders {
  return {
    findUserByID: getMongooseIDLoader(User),
    findUserBySlug: getMongooseSlugLoader(User),

    findSportByID: getMongooseIDLoader(Sport),
    findSportBySlug: getMongooseSlugLoader(Sport),

    findLockerRoomByID: getMongooseIDLoader(LockerRoom),
    findLockerRoomBySlug: getMongooseSlugLoader(LockerRoom),

    findLeagueByID: getMongooseIDLoader(League),
    findLeagueBySlug: getMongooseSlugLoader(League),

    findClubByID: getMongooseIDLoader(Club),
    findClubBySlug: getMongooseSlugLoader(Club),

    findFanGroupByID: getMongooseIDLoader(FanGroup),
    findFanGroupBySlug: getMongooseSlugLoader(FanGroup),

    findChannelGroupByID: getMongooseIDLoader(ChannelGroup),
    findChannelGroupBySlug: getMongooseSlugLoader(ChannelGroup),

    findChannelByID: getMongooseIDLoader(Channel),
    findChannelBySlug: getMongooseSlugLoader(Channel),

    findGroupAggregateByGroup: getMongooseGroupLoader(GroupAggregates),

    findInHouseByID: getMongooseIDLoader(InHouse),
    findInHouseBySlug: getMongooseSlugLoader(InHouse),
  };
}
