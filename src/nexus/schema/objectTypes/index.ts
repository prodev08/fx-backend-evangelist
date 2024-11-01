import {objectType} from 'nexus';
import {NexusGenObjects} from '../../generated/typings';

function createPagedItems(name: string, type: keyof NexusGenObjects, nextAsString: boolean) {
  if (nextAsString) {
    return objectType({
      name,
      definition(t) {
        t.list.nonNull.field('items', {type});
        t.int('count');
        t.string('next');
        t.int('total');
      },
    });
  } else {
    return objectType({
      name,
      definition(t) {
        t.list.nonNull.field('items', {type});
        t.int('count');
        t.int('next');
        t.int('total');
      },
    });
  }
}

// Paged objects
export const Users = createPagedItems('Users', 'User', true);
export const Leagues = createPagedItems('Leagues', 'League', false);
export const Clubs = createPagedItems('Clubs', 'Club', false);
export const ChannelGroups = createPagedItems('ChannelGroups', 'ChannelGroup', false);
export const Channels = createPagedItems('Channels', 'Channel', false);
export const Sports = createPagedItems('Sports', 'Sport', false);
export const UserRoles = createPagedItems('UserRoles', 'UserRole', false);
export const LockerRooms = createPagedItems('LockerRooms', 'LockerRoom', false);
export const Messages = createPagedItems('Messages', 'Message', false);
export const MessagesNextAsString = createPagedItems('MessagesNextAsString', 'Message', true);
export const FanGroups = createPagedItems('FanGroups', 'FanGroup', false);
export const Notifications = createPagedItems('Notifications', 'Notification', false);
export const InHouses = createPagedItems('InHouses', 'InHouse', false);
export const Games = createPagedItems('Games', 'Game', true);
export const GamePartners = createPagedItems('GamePartners', 'GamePartner', false);

// Standalone objects
export * from './User';
export * from './League';
export * from './MutationResult';
export * from './Sport';
export * from './Club';
export * from './ChannelGroup';
export * from './Channel';
export * from './UserRole';
export * from './UserRoleType';
// export * from './Supporting';
export * from './Me';
export * from './LockerRoom';
export * from './Message';
export * from './Media';
export * from './UserInvite';
export * from './UserInviteData';
export * from './ReadMessage';
export * from './ChannelAndChannelGroup';
export * from './FanGroup';
export * from './PhotoURL';
export * from './Notification';
export * from './LockerRoomsByLeague';
export * from './Notification';
export * from './NotificationWithMessages';
export * from './Livestream';
export * from './LivestreamSource';
export * from './Utilities';
export * from './InHouse';
export * from './Game';
export * from './Link';
export * from './ZipCode';
export * from './GamePartner';
export * from './GameReminder';
