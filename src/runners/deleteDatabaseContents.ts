import '../initializers';
import {
  Channel,
  ChannelGroup,
  Club,
  GroupAggregates,
  InHouse,
  League,
  LockerRoom,
  Message,
  Notification,
  Sport,
  UserRole,
  UserInvites,
  ReadMessage,
  FanGroup,
  // User,
  // UserAggregates,
  // FormEntry,
  // CMSUser,
  // Logs,
  // ProfileAction,
} from 'lib-mongoose';
// import * as admin from 'firebase-admin';
// import {ListUsersResult, UserRecord} from 'firebase-admin/lib/auth';

async function main() {
  // let newPageToken = undefined;
  // do {
  //   const {users, pageToken}: ListUsersResult = await admin.auth().listUsers(100, newPageToken);
  //   newPageToken = pageToken;
  //   const uids = await Promise.all(users.map((user: UserRecord) => user.uid));
  //   await admin.auth().deleteUsers(uids);
  // } while (newPageToken !== undefined);
  const ChannelDB = await Channel.deleteMany({});
  console.log('ChannelDB', ChannelDB);
  const ChannelGroupDB = await ChannelGroup.deleteMany({});
  console.log('ChannelGroupDB', ChannelGroupDB);
  const ClubDB = await Club.deleteMany({});
  console.log('ClubDB', ClubDB);
  // const CMSUserDB = await CMSUser.deleteMany({});
  // console.log('CMSUserDB', CMSUserDB);
  const FanGroupDB = await FanGroup.deleteMany({});
  console.log('FanGroupDB', FanGroupDB);
  // DO NOT RUN ON DEV
  // const FormEntryDB = await FormEntry.deleteMany({});
  // console.log('FormEntryDB', FormEntryDB);
  const GroupAggregatesDB = await GroupAggregates.deleteMany({});
  console.log('GroupAggregatesDB', GroupAggregatesDB);
  const InHouseDB = await InHouse.deleteMany({});
  console.log('InHouseDB', InHouseDB);
  const LeagueDB = await League.deleteMany({});
  console.log('LeagueDB', LeagueDB);
  const LockerRoomDB = await LockerRoom.deleteMany({});
  console.log('LockerRoomDB', LockerRoomDB);
  // const LogsDB = await Logs.deleteMany({});
  // console.log('LogsDB', LogsDB);
  const MessageDB = await Message.deleteMany({});
  console.log('MessageDB', MessageDB);
  const NotificationDB = await Notification.deleteMany({});
  console.log('NotificationDB', NotificationDB);
  const ReadMessageDB = await ReadMessage.deleteMany({});
  console.log('ReadMessageDB', ReadMessageDB);
  // const ProfileActionDB = await ProfileAction.deleteMany({});
  // console.log('ProfileActionDB', ProfileActionDB);
  const SportDB = await Sport.deleteMany({});
  console.log('SportDB', SportDB);
  // const UserDB = await User.deleteMany({});
  // console.log('UserDB', UserDB);
  // const UserAggregatesDB = await UserAggregates.deleteMany({});
  // console.log('UserAggregatesDB', UserAggregatesDB);
  const UserInvitesDB = await UserInvites.deleteMany({});
  console.log('UserInvitesDB', UserInvitesDB);
  const UserRoleDB = await UserRole.deleteMany({});
  console.log('UserRoleDB', UserRoleDB);
  // const UserRoleTypeDB = await UserRoleType.deleteMany({});
  // console.log('UserRoleTypeDB', UserRoleTypeDB);
  console.log('Done!');
}

main();
