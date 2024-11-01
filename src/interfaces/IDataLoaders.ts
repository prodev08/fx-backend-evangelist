// eslint-disable-next-line node/no-extraneous-import
import DataLoader from 'dataloader';
import {
  ChannelDocument,
  ChannelGroupDocument,
  ClubDocument,
  FanGroupDocument,
  GroupAggregatesDocument,
  InHouseDocument,
  LeagueDocument,
  LockerRoomDocument,
  SportDocument,
  UserDocument,
} from 'lib-mongoose';

export interface IDataLoaders {
  findUserByID: DataLoader<string, UserDocument | undefined>;
  findUserBySlug: DataLoader<string, UserDocument | undefined>;

  findSportByID: DataLoader<string, SportDocument | undefined>;
  findSportBySlug: DataLoader<string, SportDocument | undefined>;

  findLockerRoomByID: DataLoader<string, LockerRoomDocument | undefined>;
  findLockerRoomBySlug: DataLoader<string, LockerRoomDocument | undefined>;

  findLeagueByID: DataLoader<string, LeagueDocument | undefined>;
  findLeagueBySlug: DataLoader<string, LeagueDocument | undefined>;

  findClubByID: DataLoader<string, ClubDocument | undefined>;
  findClubBySlug: DataLoader<string, ClubDocument | undefined>;

  findFanGroupByID: DataLoader<string, FanGroupDocument | undefined>;
  findFanGroupBySlug: DataLoader<string, FanGroupDocument | undefined>;

  findChannelGroupByID: DataLoader<string, ChannelGroupDocument | undefined>;
  findChannelGroupBySlug: DataLoader<string, ChannelGroupDocument | undefined>;

  findChannelByID: DataLoader<string, ChannelDocument | undefined>;
  findChannelBySlug: DataLoader<string, ChannelDocument | undefined>;

  findGroupAggregateByGroup: DataLoader<string, GroupAggregatesDocument | undefined>;

  findInHouseByID: DataLoader<string, InHouseDocument | undefined>;
  findInHouseBySlug: DataLoader<string, InHouseDocument | undefined>;
}
