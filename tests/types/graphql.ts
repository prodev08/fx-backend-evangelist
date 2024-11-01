import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { gql } from 'graphql-request';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type Channel = {
  __typename?: 'Channel';
  Livestream?: Maybe<Livestream>;
  channelGroupID: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  livestreamID?: Maybe<Scalars['String']>;
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  type: Scalars['String'];
  unreadMessagesCount?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type ChannelAndChannelGroup = {
  __typename?: 'ChannelAndChannelGroup';
  ChannelGroups?: Maybe<Array<Maybe<ChannelGroup>>>;
  Channels?: Maybe<Array<Maybe<Channel>>>;
};

export type ChannelGroup = {
  __typename?: 'ChannelGroup';
  Channels?: Maybe<Array<Maybe<Channel>>>;
  createdAt?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  group: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  withLivestream?: Maybe<Scalars['Boolean']>;
};

export type ChannelGroups = {
  __typename?: 'ChannelGroups';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<ChannelGroup>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Channels = {
  __typename?: 'Channels';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Channel>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Club = {
  __typename?: 'Club';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  createdAt?: Maybe<Scalars['Float']>;
  defaultChannelSlug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isFeatured?: Maybe<Scalars['Boolean']>;
  leagueID?: Maybe<Scalars['String']>;
  leagueName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  supporterCount?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type Clubs = {
  __typename?: 'Clubs';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Club>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type FanGroup = {
  __typename?: 'FanGroup';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type FanGroups = {
  __typename?: 'FanGroups';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<FanGroup>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Game = {
  __typename?: 'Game';
  competition?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  date: Scalars['Float'];
  gameID: Scalars['Int'];
  group: Scalars['String'];
  headline?: Maybe<Scalars['String']>;
  highPoints?: Maybe<Scalars['Int']>;
  isReminded?: Maybe<Scalars['Boolean']>;
  leagueCode?: Maybe<Scalars['String']>;
  links?: Maybe<Array<Maybe<Link>>>;
  location?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
  pointsLevel?: Maybe<Scalars['String']>;
  sport: Scalars['String'];
  team1City?: Maybe<Scalars['String']>;
  team1Color?: Maybe<Scalars['String']>;
  team1ID?: Maybe<Scalars['Int']>;
  team1Name?: Maybe<Scalars['String']>;
  team1Ranking?: Maybe<Scalars['Int']>;
  team1Score?: Maybe<Scalars['Int']>;
  team2City?: Maybe<Scalars['String']>;
  team2Color?: Maybe<Scalars['String']>;
  team2ID?: Maybe<Scalars['Int']>;
  team2Name?: Maybe<Scalars['String']>;
  team2Ranking?: Maybe<Scalars['Int']>;
  team2Score?: Maybe<Scalars['Int']>;
  timeLeft?: Maybe<Scalars['String']>;
};

export type GameByLeague = {
  __typename?: 'GameByLeague';
  concacaf?: Maybe<Games>;
  efl?: Maybe<Games>;
  epl?: Maybe<Games>;
  mlb?: Maybe<Games>;
  mls?: Maybe<Games>;
  nba?: Maybe<Games>;
  ncaa?: Maybe<Games>;
  nhl?: Maybe<Games>;
  uefa?: Maybe<Games>;
  wnba?: Maybe<Games>;
};

export type GamePartner = {
  __typename?: 'GamePartner';
  Icon?: Maybe<Media>;
  Logo?: Maybe<Media>;
  id?: Maybe<Scalars['ID']>;
  isHidden?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type GamePartners = {
  __typename?: 'GamePartners';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<GamePartner>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type GameReminder = {
  __typename?: 'GameReminder';
  createdAt?: Maybe<Scalars['Float']>;
  emailBatchID?: Maybe<Scalars['String']>;
  gameID: Scalars['String'];
  reminderSent?: Maybe<Scalars['Boolean']>;
  scheduledTime?: Maybe<Scalars['Float']>;
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  userID: Scalars['String'];
};

export type Games = {
  __typename?: 'Games';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Game>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type InHouse = {
  __typename?: 'InHouse';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type InHouses = {
  __typename?: 'InHouses';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<InHouse>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type InputCreateChannel = {
  channelGroupID: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  type: Scalars['String'];
};

export type InputCreateChannelGroup = {
  description?: InputMaybe<Scalars['String']>;
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
};

export type InputCreateClub = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  leagueID: Scalars['String'];
  name: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
};

export type InputEditChannel = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  type: Scalars['String'];
};

export type InputEditChannelGroup = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type InputEditClub = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  name: Scalars['String'];
};

export type InputEditUser = {
  Avatar?: InputMaybe<InputMedia>;
};

export type InputInviteUserForManagerialRole = {
  emailAddress?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
};

export type InputMedia = {
  objectID: Scalars['String'];
  objectType: Scalars['String'];
};

export type InputQueryMedia = {
  isSport: Scalars['Boolean'];
  objectID: Scalars['String'];
  objectType: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};

export type InputUpdateLockerRoomUserRoles = {
  role?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
  userID: Scalars['String'];
};

export type InputUser = {
  Avatar?: InputMaybe<InputMedia>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type League = {
  __typename?: 'League';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  boost?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type Leagues = {
  __typename?: 'Leagues';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<League>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Link = {
  __typename?: 'Link';
  avatarUrl?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Livestream = {
  __typename?: 'Livestream';
  LivestreamSource?: Maybe<LivestreamSource>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isLive?: Maybe<Scalars['Boolean']>;
  link: Scalars['String'];
  source: Scalars['String'];
  startDate?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type LivestreamSource = {
  __typename?: 'LivestreamSource';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type LockerRoom = {
  __typename?: 'LockerRoom';
  ChannelGroups?: Maybe<Array<Maybe<ChannelGroup>>>;
  Club?: Maybe<Club>;
  FanGroup?: Maybe<FanGroup>;
  Game?: Maybe<Game>;
  InHouse?: Maybe<InHouse>;
  League?: Maybe<League>;
  /** Return role if either owner or manager else null */
  MyRole?: Maybe<UserRole>;
  Roles?: Maybe<UserRolesInLockerRoom>;
  Sports?: Maybe<Array<Maybe<Sport>>>;
  channelCount?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['Float']>;
  defaultChannelSlug?: Maybe<Scalars['String']>;
  group: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  isSupported?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportsIDs: Array<Scalars['String']>;
  supporterCount?: Maybe<Scalars['Int']>;
  totalUnreadMessagesCount?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type LockerRooms = {
  __typename?: 'LockerRooms';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<LockerRoom>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type LockerRoomsByLeague = {
  __typename?: 'LockerRoomsByLeague';
  LockerRooms: LockerRooms;
  leagueID: Scalars['String'];
  leagueName: Scalars['String'];
};


export type LockerRoomsByLeagueLockerRoomsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Int']>;
};

export type Me = {
  __typename?: 'Me';
  Avatar?: Maybe<Media>;
  Supporting?: Maybe<Array<LockerRoom>>;
  ZipCode?: Maybe<ZipCode>;
  createdAt?: Maybe<Scalars['Float']>;
  emailAddress: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lastName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  uid: Scalars['String'];
  unseenNotifications: Scalars['Int'];
  updatedAt?: Maybe<Scalars['Float']>;
  username: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
};

export type Media = {
  __typename?: 'Media';
  PhotoURL?: Maybe<Scalars['String']>;
  isSport?: Maybe<Scalars['Boolean']>;
  objectID: Scalars['String'];
  objectType: Scalars['String'];
};


export type MediaPhotoUrlArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type MediaMessage = {
  __typename?: 'MediaMessage';
  PhotoURL?: Maybe<Scalars['String']>;
  isSport?: Maybe<Scalars['Boolean']>;
  objectID: Scalars['String'];
  objectType: Scalars['String'];
};


export type MediaMessagePhotoUrlArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  Media?: Maybe<Array<MediaMessage>>;
  PhotoURLs?: Maybe<Array<PhotoUrl>>;
  RepliedTo?: Maybe<Message>;
  User?: Maybe<User>;
  channelSlug: Scalars['String'];
  chatID: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isDeletedEveryone?: Maybe<Scalars['Boolean']>;
  isDeletedSelf?: Maybe<Scalars['Boolean']>;
  isEdited?: Maybe<Scalars['Boolean']>;
  isUserBlocked?: Maybe<Scalars['Boolean']>;
  repliedToChatID?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
  userID: Scalars['String'];
};

export type Messages = {
  __typename?: 'Messages';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Message>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type MessagesNextAsString = {
  __typename?: 'MessagesNextAsString';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Message>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addZipCode: ZipCode;
  blockUser: MutationResult;
  createChannel: MutationResult;
  createChannelGroup: MutationResult;
  createClub: MutationResult;
  createFormEntry: MutationResult;
  createUser: MutationResult;
  deleteChannel: MutationResult;
  deleteChannelGroup: MutationResult;
  deleteFirebaseAccount: MutationResult;
  deleteImages: MutationResult;
  deleteMessage: MutationResult;
  deleteUser: MutationResult;
  editChannel: MutationResult;
  editChannelGroup: MutationResult;
  editClub: MutationResult;
  editLockerRoomUserRole: MutationResult;
  editMessage: MutationResult;
  editUser: MutationResult;
  inviteUserForManagerialRole: MutationResult;
  readMessage: MutationResult;
  readNotification: MutationResult;
  /** @deprecated Use createFormEntry with type 'RegisterInterest' instead */
  registerInterest: MutationResult;
  removeUserManagerialRole: MutationResult;
  respondUserManagerialRoleInvite: MutationResult;
  seenNotification: MutationResult;
  sendMessage: MutationResult;
  setGameReminder: MutationResult;
  /** If UserRole exists as owner/manager, no changes will be made. */
  support: MutationResult;
  testReminderPushNotification?: Maybe<MutationResult>;
  trackLogin: MutationResult;
  trackRegisterAccount: MutationResult;
  trackSendMessage: MutationResult;
  trackSupportLockerRoom: MutationResult;
  trackUnsupportLockerRoom: MutationResult;
  trackViewPage: MutationResult;
  unblockUser: MutationResult;
  undeleteChannel: MutationResult;
  undeleteChannelGroup: MutationResult;
  unsetGameReminder: MutationResult;
  /** If UserRole exists as owner/manager, no changes will be made. */
  unsupport: MutationResult;
  updateLockerRoomUserRoles: MutationResult;
};


export type MutationAddZipCodeArgs = {
  zipCode: Scalars['String'];
};


export type MutationBlockUserArgs = {
  targetUserID: Scalars['String'];
};


export type MutationCreateChannelArgs = {
  input: InputCreateChannel;
};


export type MutationCreateChannelGroupArgs = {
  input: InputCreateChannelGroup;
};


export type MutationCreateClubArgs = {
  input: InputCreateClub;
};


export type MutationCreateFormEntryArgs = {
  data?: InputMaybe<Scalars['JSON']>;
  type: Scalars['String'];
};


export type MutationCreateUserArgs = {
  input: InputUser;
};


export type MutationDeleteChannelArgs = {
  id: Scalars['String'];
};


export type MutationDeleteChannelGroupArgs = {
  id: Scalars['String'];
};


export type MutationDeleteImagesArgs = {
  objectIDs: Array<Scalars['String']>;
};


export type MutationDeleteMessageArgs = {
  chatID: Scalars['String'];
  deleteForEveryone: Scalars['Boolean'];
  deleteForSelf: Scalars['Boolean'];
};


export type MutationEditChannelArgs = {
  id: Scalars['String'];
  input: InputEditChannel;
};


export type MutationEditChannelGroupArgs = {
  id: Scalars['String'];
  input: InputEditChannelGroup;
};


export type MutationEditClubArgs = {
  id: Scalars['String'];
  input: InputEditClub;
};


export type MutationEditLockerRoomUserRoleArgs = {
  lockerRoomID: Scalars['String'];
  role: Scalars['String'];
  userID: Scalars['String'];
};


export type MutationEditMessageArgs = {
  Media?: InputMaybe<Array<InputMedia>>;
  MentionedUserIDs?: InputMaybe<Array<Scalars['String']>>;
  chatID: Scalars['String'];
  repliedToChatID?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationEditUserArgs = {
  input: InputEditUser;
};


export type MutationInviteUserForManagerialRoleArgs = {
  input: Array<InputInviteUserForManagerialRole>;
  lockerRoomID: Scalars['String'];
};


export type MutationReadMessageArgs = {
  channelSlug: Scalars['String'];
};


export type MutationReadNotificationArgs = {
  notificationIDs: Array<Scalars['String']>;
};


export type MutationRegisterInterestArgs = {
  data?: InputMaybe<Scalars['JSON']>;
  type: Scalars['String'];
};


export type MutationRemoveUserManagerialRoleArgs = {
  lockerRoomID: Scalars['String'];
  role: Scalars['String'];
  userID: Scalars['String'];
};


export type MutationRespondUserManagerialRoleInviteArgs = {
  id: Scalars['String'];
};


export type MutationSeenNotificationArgs = {
  lastNotificationID: Scalars['String'];
};


export type MutationSendMessageArgs = {
  Media?: InputMaybe<Array<InputMedia>>;
  MentionedUserIDs?: InputMaybe<Array<Scalars['String']>>;
  channelSlug: Scalars['String'];
  chatID: Scalars['String'];
  repliedToChatID?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationSetGameReminderArgs = {
  gameID: Scalars['String'];
};


export type MutationSupportArgs = {
  lockerRoomID: Scalars['String'];
};


export type MutationTestReminderPushNotificationArgs = {
  userID: Scalars['String'];
};


export type MutationTrackLoginArgs = {
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  loginMethod: Scalars['String'];
  model?: InputMaybe<Scalars['String']>;
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationTrackRegisterAccountArgs = {
  avatar: Scalars['String'];
  avatarObjectID?: InputMaybe<Scalars['String']>;
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  ip?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<Scalars['String']>;
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  registrationMethod: Scalars['String'];
  username: Scalars['String'];
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationTrackSendMessageArgs = {
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  channel: Scalars['String'];
  ip?: InputMaybe<Scalars['String']>;
  league?: InputMaybe<Scalars['String']>;
  lockerRoomType: Scalars['String'];
  model?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  sport: Scalars['String'];
  type: Scalars['String'];
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationTrackSupportLockerRoomArgs = {
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  league?: InputMaybe<Scalars['String']>;
  lockerRoomType: Scalars['String'];
  model?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  sport: Scalars['String'];
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationTrackUnsupportLockerRoomArgs = {
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  league?: InputMaybe<Scalars['String']>;
  lockerRoomType: Scalars['String'];
  model?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  sport: Scalars['String'];
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationTrackViewPageArgs = {
  browser?: InputMaybe<Scalars['String']>;
  browserVersion?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  league?: InputMaybe<Scalars['String']>;
  lockerRoomType?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  os?: InputMaybe<Scalars['String']>;
  pageName: Scalars['String'];
  platform: Scalars['String'];
  sport?: InputMaybe<Scalars['String']>;
  webDisplaySize?: InputMaybe<Scalars['String']>;
};


export type MutationUnblockUserArgs = {
  targetUserID: Scalars['String'];
};


export type MutationUndeleteChannelArgs = {
  id: Scalars['String'];
};


export type MutationUndeleteChannelGroupArgs = {
  id: Scalars['String'];
};


export type MutationUnsetGameReminderArgs = {
  gameID: Scalars['String'];
};


export type MutationUnsupportArgs = {
  lockerRoomID: Scalars['String'];
};


export type MutationUpdateLockerRoomUserRolesArgs = {
  input: Array<InputUpdateLockerRoomUserRoles>;
  lockerRoomID: Scalars['String'];
};

export type MutationResult = {
  __typename?: 'MutationResult';
  objectID?: Maybe<Scalars['String']>;
  objectType?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  timestamp?: Maybe<Scalars['Float']>;
};

/** This is viewable on the specified owner of the targetUserID. */
export type Notification = {
  __typename?: 'Notification';
  Actor: User;
  LockerRoom: LockerRoom;
  Message: Message;
  /** This is the uid of the one who replied or mentioned a user. */
  actorUid: Scalars['String'];
  /** This is the userID of the one who replied or mentioned a user. */
  actorUserID: Scalars['String'];
  channelName: Scalars['String'];
  channelSlug: Scalars['String'];
  /** This is the chatID of the reply or where a user got mentioned. */
  chatID: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isRead?: Maybe<Scalars['Boolean']>;
  isSeen?: Maybe<Scalars['Boolean']>;
  /** This is the messageID of the reply or where a user got mentioned. */
  messageID: Scalars['String'];
  /** This is the uid of the one who got replied to or mentioned. */
  targetUid: Scalars['String'];
  /** This is the userID of the one who got replied to or mentioned. */
  targetUserID: Scalars['String'];
  type: Scalars['String'];
};

export type NotificationWithMessages = {
  __typename?: 'NotificationWithMessages';
  Messages: Array<Message>;
  Notification: Notification;
};

export type Notifications = {
  __typename?: 'Notifications';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Notification>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type PhotoUrl = {
  __typename?: 'PhotoURL';
  photoURL?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  Me?: Maybe<Me>;
  Supporting?: Maybe<Array<Maybe<LockerRoom>>>;
  channelExists?: Maybe<Scalars['Boolean']>;
  channelGroupExists?: Maybe<Scalars['Boolean']>;
  getAllUsersViaUsername: Users;
  getChannel?: Maybe<Channel>;
  getChannelGroup?: Maybe<ChannelGroup>;
  getChannelGroups: ChannelGroups;
  getChannels: Channels;
  getClub?: Maybe<Club>;
  getClubs: Clubs;
  getDeletedChannelAndChannelGroups?: Maybe<ChannelAndChannelGroup>;
  getFanGroup?: Maybe<FanGroup>;
  getFanGroups: FanGroups;
  getFeatured: Array<LockerRoom>;
  getFeaturedGame?: Maybe<Game>;
  getGame?: Maybe<Game>;
  getGamePartners: GamePartners;
  getGameRemindersForCloudFunction: Array<Maybe<GameReminder>>;
  getGames: Games;
  getInHouse?: Maybe<InHouse>;
  getInHouses: InHouses;
  getLeague?: Maybe<League>;
  getLeagues: Leagues;
  getLockerRoom?: Maybe<LockerRoom>;
  getLockerRooms: LockerRooms;
  getMessage?: Maybe<Message>;
  getMessagesByChannelSlug: Messages;
  getMessagesByChannelSlugUsingCreatedAtAsCursor: MessagesNextAsString;
  /** API that will return the focused chat sandwiched between 1 message above if available and at least 1 message below */
  getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification: MessagesNextAsString;
  /** API that is a combination of getMessagesByChannelSlugUsingCreatedAtAsCursor (commented) and getMessagesByChannelSlugUsingCreatedAtAsCursorFromNotification */
  getMessagesByChannelSlugUsingCreatedAtAsCursorV2: MessagesNextAsString;
  getNotification?: Maybe<Notification>;
  getNotificationWithMessages?: Maybe<NotificationWithMessages>;
  getNotifications?: Maybe<Notifications>;
  getPhotoURL?: Maybe<Scalars['String']>;
  getPhotoURLs?: Maybe<Array<Maybe<Scalars['String']>>>;
  getSport?: Maybe<Sport>;
  /** This is for the OG querying of sport and currently used in the landing page and OG locker rooms */
  getSports: Sports;
  /** This is for the new explore page. Should be use to show the sports that has an Icon. */
  getSportsWithIcon: Sports;
  getUnreadMessages?: Maybe<Array<Maybe<ReadMessage>>>;
  getUser?: Maybe<User>;
  getUserInvite?: Maybe<UserInvite>;
  getUserRolesInLockerRoom?: Maybe<UserRolesInLockerRoom>;
  getUsers: Users;
  getUsersByLockerRoom: Users;
  getUtilities?: Maybe<Utilities>;
  getZipCode?: Maybe<ZipCode>;
  invitedUserExists?: Maybe<Scalars['Boolean']>;
  userNameExists?: Maybe<Scalars['Boolean']>;
};


export type QueryChannelExistsArgs = {
  channelGroupID: Scalars['String'];
  name: Scalars['String'];
};


export type QueryChannelGroupExistsArgs = {
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
};


export type QueryGetAllUsersViaUsernameArgs = {
  text?: InputMaybe<Scalars['String']>;
};


export type QueryGetChannelArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetChannelGroupArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetChannelsArgs = {
  channelGroupID?: InputMaybe<Scalars['String']>;
};


export type QueryGetClubArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetFanGroupArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetGameArgs = {
  gameID: Scalars['Int'];
};


export type QueryGetGamesArgs = {
  count?: InputMaybe<Scalars['Int']>;
  leagueCodes?: InputMaybe<Scalars['String']>;
  next?: InputMaybe<Scalars['String']>;
  partnerNames?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};


export type QueryGetInHouseArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetLeagueArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetLockerRoomArgs = {
  group?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetMessageArgs = {
  id: Scalars['String'];
};


export type QueryGetMessagesByChannelSlugArgs = {
  channelSlug: Scalars['String'];
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Int']>;
};


export type QueryGetMessagesByChannelSlugUsingCreatedAtAsCursorArgs = {
  channelSlug: Scalars['String'];
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['String']>;
  direction: Scalars['String'];
};


export type QueryGetMessagesByChannelSlugUsingCreatedAtAsCursorFromNotificationArgs = {
  channelSlug: Scalars['String'];
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['String']>;
};


export type QueryGetMessagesByChannelSlugUsingCreatedAtAsCursorV2Args = {
  channelSlug: Scalars['String'];
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['String']>;
  direction: Scalars['String'];
  withAdditional: Scalars['Boolean'];
};


export type QueryGetNotificationArgs = {
  id: Scalars['String'];
};


export type QueryGetNotificationWithMessagesArgs = {
  id: Scalars['String'];
};


export type QueryGetNotificationsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Int']>;
  isRead?: InputMaybe<Scalars['Boolean']>;
};


export type QueryGetPhotoUrlArgs = {
  isSport?: InputMaybe<Scalars['Boolean']>;
  objectID: Scalars['String'];
  objectType: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};


export type QueryGetPhotoUrLsArgs = {
  input: Array<InputQueryMedia>;
};


export type QueryGetSportArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetUnreadMessagesArgs = {
  lockerRoomID: Scalars['String'];
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserInviteArgs = {
  id: Scalars['String'];
};


export type QueryGetUserRolesInLockerRoomArgs = {
  lockerRoomID: Scalars['String'];
};


export type QueryGetUsersByLockerRoomArgs = {
  lockerRoomID: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
};


export type QueryGetZipCodeArgs = {
  zipCode?: InputMaybe<Scalars['String']>;
};


export type QueryInvitedUserExistsArgs = {
  id: Scalars['String'];
};


export type QueryUserNameExistsArgs = {
  username: Scalars['String'];
};

export type ReadMessage = {
  __typename?: 'ReadMessage';
  channelSlug: Scalars['String'];
  unreadMessagesCount?: Maybe<Scalars['Float']>;
};

export type Sport = {
  __typename?: 'Sport';
  Avatar: Media;
  CoverPhoto: Media;
  FanGroupLockerRooms: LockerRooms;
  Icon?: Maybe<Media>;
  LockerRooms: LockerRooms;
  LockerRoomsByLeague: Array<LockerRoomsByLeague>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};


export type SportFanGroupLockerRoomsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Int']>;
};


export type SportLockerRoomsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Int']>;
};

export type Sports = {
  __typename?: 'Sports';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Sport>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  Avatar?: Maybe<Media>;
  createdAt?: Maybe<Scalars['Float']>;
  emailAddress: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isBlocked?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  username: Scalars['String'];
};

export type UserInvite = {
  __typename?: 'UserInvite';
  data?: Maybe<UserInviteData>;
  expiration?: Maybe<Scalars['Float']>;
  group: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  time?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  userID: Scalars['String'];
};

export type UserInviteData = {
  __typename?: 'UserInviteData';
  emailAddress?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  lockerRoomID?: Maybe<Scalars['String']>;
  lockerRoomSlug?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type UserRole = {
  __typename?: 'UserRole';
  User: User;
  UserRoleType?: Maybe<Array<UserRoleType>>;
  createdAt?: Maybe<Scalars['Float']>;
  group: Scalars['String'];
  groupID: Scalars['String'];
  groupType: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
  lockerRoomID: Scalars['String'];
  role: Scalars['String'];
  status: Scalars['String'];
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  userID: Scalars['String'];
};

export type UserRoleType = {
  __typename?: 'UserRoleType';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type UserRoles = {
  __typename?: 'UserRoles';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<UserRole>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type UserRolesInLockerRoom = {
  __typename?: 'UserRolesInLockerRoom';
  Managers: Array<UserRole>;
  Owners: Array<UserRole>;
  Supporters: Array<UserRole>;
};

export type Users = {
  __typename?: 'Users';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<User>>;
  next?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Utilities = {
  __typename?: 'Utilities';
  Utilities?: Maybe<Scalars['JSON']>;
};

export type ZipCode = {
  __typename?: 'ZipCode';
  city: Scalars['String'];
  country: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  state: Scalars['String'];
  zip: Scalars['String'];
};

export type BlockUserMutationVariables = Exact<{
  targetUserID: Scalars['String'];
}>;


export type BlockUserMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateChannelMutationVariables = Exact<{
  input: InputCreateChannel;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateChannelGroupMutationVariables = Exact<{
  input: InputCreateChannelGroup;
}>;


export type CreateChannelGroupMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateClubMutationVariables = Exact<{
  input: InputCreateClub;
}>;


export type CreateClubMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateFormEntryMutationVariables = Exact<{
  type: Scalars['String'];
  data?: InputMaybe<Scalars['JSON']>;
}>;


export type CreateFormEntryMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type DeleteChannelMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type DeleteChannelGroupMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteChannelGroupMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type DeleteMessageMutationVariables = Exact<{
  chatID: Scalars['String'];
  deleteForSelf: Scalars['Boolean'];
  deleteForEveryone: Scalars['Boolean'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditChannelMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputEditChannel;
}>;


export type EditChannelMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditChannelGroupMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputEditChannelGroup;
}>;


export type EditChannelGroupMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditClubMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputEditClub;
}>;


export type EditClubMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditMessageMutationVariables = Exact<{
  chatID: Scalars['String'];
  text: Scalars['String'];
  repliedToChatID?: InputMaybe<Scalars['String']>;
  Media?: InputMaybe<Array<InputMedia> | InputMedia>;
  MentionedUserIDs?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type EditMessageMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type SendMessageMutationVariables = Exact<{
  channelSlug: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
  chatID: Scalars['String'];
  repliedToChatID?: InputMaybe<Scalars['String']>;
  Media?: InputMaybe<Array<InputMedia> | InputMedia>;
  MentionedUserIDs?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type SupportMutationVariables = Exact<{
  lockerRoomID: Scalars['String'];
}>;


export type SupportMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type UnsupportMutationVariables = Exact<{
  lockerRoomID: Scalars['String'];
}>;


export type UnsupportMutation = { __typename?: 'Mutation', return: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type UndeleteChannelMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UndeleteChannelMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type UndeleteChannelGroupMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UndeleteChannelGroupMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type GetChannelQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetChannelQuery = { __typename?: 'Query', result?: { __typename?: 'Channel', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, channelGroupID: string, type: string, isDeleted?: boolean | null, unreadMessagesCount?: number | null } | null };

export type GetChannelGroupQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetChannelGroupQuery = { __typename?: 'Query', result?: { __typename?: 'ChannelGroup', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, group: string, lockerRoomID: string, isDeleted?: boolean | null, Channels?: Array<{ __typename?: 'Channel', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, channelGroupID: string, type: string, isDeleted?: boolean | null, unreadMessagesCount?: number | null } | null> | null } | null };

export type GetChannelGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelGroupsQuery = { __typename?: 'Query', result: { __typename?: 'ChannelGroups', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'ChannelGroup', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, group: string, lockerRoomID: string, isDeleted?: boolean | null, Channels?: Array<{ __typename?: 'Channel', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, channelGroupID: string, type: string, isDeleted?: boolean | null, unreadMessagesCount?: number | null } | null> | null }> | null } };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { __typename?: 'Query', result: { __typename?: 'Channels', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'Channel', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, description?: string | null, channelGroupID: string, type: string, isDeleted?: boolean | null, unreadMessagesCount?: number | null }> | null } };

export type GetClubQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetClubQuery = { __typename?: 'Query', result?: { __typename?: 'Club', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, leagueID?: string | null, isFeatured?: boolean | null, defaultChannelSlug?: string | null, leagueName?: string | null, supporterCount?: number | null, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null } | null };

export type GetClubsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClubsQuery = { __typename?: 'Query', result: { __typename?: 'Clubs', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'Club', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, leagueID?: string | null, isFeatured?: boolean | null, defaultChannelSlug?: string | null, leagueName?: string | null, supporterCount?: number | null, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null }> | null } };

export type GetFanGroupQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetFanGroupQuery = { __typename?: 'Query', result?: { __typename?: 'FanGroup', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null } | null };

export type GetFanGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFanGroupsQuery = { __typename?: 'Query', result: { __typename?: 'FanGroups', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'FanGroup', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null }> | null } };

export type GetLeagueQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetLeagueQuery = { __typename?: 'Query', result?: { __typename?: 'League', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null } | null };

export type GetLeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeaguesQuery = { __typename?: 'Query', result: { __typename?: 'Leagues', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'League', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } | null }> | null } };

export type GetSportQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetSportQuery = { __typename?: 'Query', result?: { __typename?: 'Sport', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string } | null };

export type GetSportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSportsQuery = { __typename?: 'Query', result: { __typename?: 'Sports', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'Sport', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string }> | null } };


export const BlockUserDocument = gql`
    mutation blockUser($targetUserID: String!) {
  result: blockUser(targetUserID: $targetUserID) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateChannelDocument = gql`
    mutation createChannel($input: InputCreateChannel!) {
  result: createChannel(input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateChannelGroupDocument = gql`
    mutation createChannelGroup($input: InputCreateChannelGroup!) {
  result: createChannelGroup(input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateClubDocument = gql`
    mutation createClub($input: InputCreateClub!) {
  result: createClub(input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateFormEntryDocument = gql`
    mutation createFormEntry($type: String!, $data: JSON) {
  result: createFormEntry(type: $type, data: $data) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const DeleteChannelDocument = gql`
    mutation deleteChannel($id: String!) {
  result: deleteChannel(id: $id) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const DeleteChannelGroupDocument = gql`
    mutation deleteChannelGroup($id: String!) {
  result: deleteChannelGroup(id: $id) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const DeleteMessageDocument = gql`
    mutation deleteMessage($chatID: String!, $deleteForSelf: Boolean!, $deleteForEveryone: Boolean!) {
  result: deleteMessage(
    chatID: $chatID
    deleteForSelf: $deleteForSelf
    deleteForEveryone: $deleteForEveryone
  ) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditChannelDocument = gql`
    mutation editChannel($id: String!, $input: InputEditChannel!) {
  result: editChannel(id: $id, input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditChannelGroupDocument = gql`
    mutation editChannelGroup($id: String!, $input: InputEditChannelGroup!) {
  result: editChannelGroup(id: $id, input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditClubDocument = gql`
    mutation editClub($id: String!, $input: InputEditClub!) {
  result: editClub(id: $id, input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditMessageDocument = gql`
    mutation editMessage($chatID: String!, $text: String!, $repliedToChatID: String, $Media: [InputMedia!], $MentionedUserIDs: [String!]) {
  result: editMessage(
    chatID: $chatID
    text: $text
    repliedToChatID: $repliedToChatID
    Media: $Media
    MentionedUserIDs: $MentionedUserIDs
  ) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const SendMessageDocument = gql`
    mutation sendMessage($channelSlug: String!, $text: String, $chatID: String!, $repliedToChatID: String, $Media: [InputMedia!], $MentionedUserIDs: [String!]) {
  result: sendMessage(
    channelSlug: $channelSlug
    text: $text
    chatID: $chatID
    repliedToChatID: $repliedToChatID
    Media: $Media
    MentionedUserIDs: $MentionedUserIDs
  ) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const SupportDocument = gql`
    mutation support($lockerRoomID: String!) {
  result: support(lockerRoomID: $lockerRoomID) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const UnsupportDocument = gql`
    mutation unsupport($lockerRoomID: String!) {
  return: unsupport(lockerRoomID: $lockerRoomID) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const UndeleteChannelDocument = gql`
    mutation undeleteChannel($id: String!) {
  result: undeleteChannel(id: $id) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const UndeleteChannelGroupDocument = gql`
    mutation undeleteChannelGroup($id: String!) {
  result: undeleteChannelGroup(id: $id) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const GetChannelDocument = gql`
    query getChannel($id: String, $slug: String) {
  result: getChannel(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    description
    channelGroupID
    type
    isDeleted
    unreadMessagesCount
  }
}
    `;
export const GetChannelGroupDocument = gql`
    query getChannelGroup($id: String, $slug: String) {
  result: getChannelGroup(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    description
    group
    lockerRoomID
    isDeleted
    Channels {
      id
      createdAt
      updatedAt
      name
      slug
      description
      channelGroupID
      type
      isDeleted
      unreadMessagesCount
    }
  }
}
    `;
export const GetChannelGroupsDocument = gql`
    query getChannelGroups {
  result: getChannelGroups {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      description
      group
      lockerRoomID
      isDeleted
      Channels {
        id
        createdAt
        updatedAt
        name
        slug
        description
        channelGroupID
        type
        isDeleted
        unreadMessagesCount
      }
    }
  }
}
    `;
export const GetChannelsDocument = gql`
    query getChannels {
  result: getChannels {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      description
      channelGroupID
      type
      isDeleted
      unreadMessagesCount
    }
  }
}
    `;
export const GetClubDocument = gql`
    query getClub($id: String, $slug: String) {
  result: getClub(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    sportIDs
    Avatar {
      objectID
      objectType
      isSport
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      isSport
      PhotoURL
    }
    leagueID
    isFeatured
    defaultChannelSlug
    leagueName
    supporterCount
  }
}
    `;
export const GetClubsDocument = gql`
    query getClubs {
  result: getClubs {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      sportIDs
      Avatar {
        objectID
        objectType
        isSport
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        isSport
        PhotoURL
      }
      leagueID
      isFeatured
      defaultChannelSlug
      leagueName
      supporterCount
    }
  }
}
    `;
export const GetFanGroupDocument = gql`
    query getFanGroup($id: String, $slug: String) {
  result: getFanGroup(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    sportIDs
    Avatar {
      objectID
      objectType
      isSport
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      isSport
      PhotoURL
    }
  }
}
    `;
export const GetFanGroupsDocument = gql`
    query getFanGroups {
  result: getFanGroups {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      sportIDs
      Avatar {
        objectID
        objectType
        isSport
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        isSport
        PhotoURL
      }
    }
  }
}
    `;
export const GetLeagueDocument = gql`
    query getLeague($id: String, $slug: String) {
  result: getLeague(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    sportIDs
    Avatar {
      objectID
      objectType
      isSport
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      isSport
      PhotoURL
    }
  }
}
    `;
export const GetLeaguesDocument = gql`
    query getLeagues {
  result: getLeagues {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      Avatar {
        objectID
        objectType
        isSport
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        isSport
        PhotoURL
      }
    }
  }
}
    `;
export const GetSportDocument = gql`
    query getSport($id: String, $slug: String) {
  result: getSport(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
  }
}
    `;
export const GetSportsDocument = gql`
    query getSports {
  result: getSports {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    blockUser(variables: BlockUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BlockUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlockUserMutation>(BlockUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'blockUser', 'mutation');
    },
    createChannel(variables: CreateChannelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateChannelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateChannelMutation>(CreateChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createChannel', 'mutation');
    },
    createChannelGroup(variables: CreateChannelGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateChannelGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateChannelGroupMutation>(CreateChannelGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createChannelGroup', 'mutation');
    },
    createClub(variables: CreateClubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateClubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateClubMutation>(CreateClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createClub', 'mutation');
    },
    createFormEntry(variables: CreateFormEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateFormEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateFormEntryMutation>(CreateFormEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createFormEntry', 'mutation');
    },
    deleteChannel(variables: DeleteChannelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteChannelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteChannelMutation>(DeleteChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteChannel', 'mutation');
    },
    deleteChannelGroup(variables: DeleteChannelGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteChannelGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteChannelGroupMutation>(DeleteChannelGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteChannelGroup', 'mutation');
    },
    deleteMessage(variables: DeleteMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMessageMutation>(DeleteMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMessage', 'mutation');
    },
    editChannel(variables: EditChannelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditChannelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditChannelMutation>(EditChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editChannel', 'mutation');
    },
    editChannelGroup(variables: EditChannelGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditChannelGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditChannelGroupMutation>(EditChannelGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editChannelGroup', 'mutation');
    },
    editClub(variables: EditClubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditClubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditClubMutation>(EditClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editClub', 'mutation');
    },
    editMessage(variables: EditMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditMessageMutation>(EditMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editMessage', 'mutation');
    },
    sendMessage(variables: SendMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendMessageMutation>(SendMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sendMessage', 'mutation');
    },
    support(variables: SupportMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SupportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SupportMutation>(SupportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'support', 'mutation');
    },
    unsupport(variables: UnsupportMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UnsupportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnsupportMutation>(UnsupportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unsupport', 'mutation');
    },
    undeleteChannel(variables: UndeleteChannelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UndeleteChannelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UndeleteChannelMutation>(UndeleteChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'undeleteChannel', 'mutation');
    },
    undeleteChannelGroup(variables: UndeleteChannelGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UndeleteChannelGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UndeleteChannelGroupMutation>(UndeleteChannelGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'undeleteChannelGroup', 'mutation');
    },
    getChannel(variables?: GetChannelQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetChannelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetChannelQuery>(GetChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getChannel', 'query');
    },
    getChannelGroup(variables?: GetChannelGroupQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetChannelGroupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetChannelGroupQuery>(GetChannelGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getChannelGroup', 'query');
    },
    getChannelGroups(variables?: GetChannelGroupsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetChannelGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetChannelGroupsQuery>(GetChannelGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getChannelGroups', 'query');
    },
    getChannels(variables?: GetChannelsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetChannelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetChannelsQuery>(GetChannelsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getChannels', 'query');
    },
    getClub(variables?: GetClubQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClubQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClubQuery>(GetClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClub', 'query');
    },
    getClubs(variables?: GetClubsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClubsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClubsQuery>(GetClubsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClubs', 'query');
    },
    getFanGroup(variables?: GetFanGroupQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFanGroupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFanGroupQuery>(GetFanGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getFanGroup', 'query');
    },
    getFanGroups(variables?: GetFanGroupsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFanGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFanGroupsQuery>(GetFanGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getFanGroups', 'query');
    },
    getLeague(variables?: GetLeagueQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLeagueQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLeagueQuery>(GetLeagueDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLeague', 'query');
    },
    getLeagues(variables?: GetLeaguesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLeaguesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLeaguesQuery>(GetLeaguesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLeagues', 'query');
    },
    getSport(variables?: GetSportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSportQuery>(GetSportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSport', 'query');
    },
    getSports(variables?: GetSportsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSportsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSportsQuery>(GetSportsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSports', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;