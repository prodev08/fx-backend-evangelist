// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {
  Channel,
  ChannelGroup,
  LockerRoom,
  Club,
  League,
  Sport,
  //User,
  GroupAggregates,
  ChannelDocument,
} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
//import {channelFilter} from '../../src/utilities';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
let channelObjectID: string;
let channelSlug: string;
const emailAddress = 'automatedtester1@fx1.io';
const password = 'p588w012D';

let sportGroup: string;
let league: string;
let club: string;
let lockerRoom: string;
let channelGroup: string;
//let userID: string;
//let uid: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  const client = new GraphQLClient(url);
  // @ts-ignore
  firebaseApp = initializeApp(firebaseConfig[global.appEnv]);
  const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress, password);
  authToken = await user.getIdToken(true);
  api = getSdk(client);
  channelObjectID = (await Channel.find().exec())[0].id;
  channelSlug = (await Channel.findById(channelObjectID).exec())!.slug!;
  sportGroup = (await Sport.find().exec())[0].id;
  league = (await League.findOne({
    sportIDs: `${sportGroup}`,
  }).exec())!.id!;
  club = (await Club.findOne({
    sportIDs: `${sportGroup}`,
    leagueID: `${league}`,
  }).exec())!.id!;
  lockerRoom = (await LockerRoom.findOne({
    group: `Club:${club}`,
  }).exec())!.id!;
  channelGroup = (await ChannelGroup.findOne({
    lockerRoomID: `${lockerRoom}`,
  }).exec())!.id!;
  //  ({id: userID, uid} = (await User.findOne({emailAddress}).exec())!);
});

export default () => {
  describe('12. Test Create of Channel', () => {
    let initialChannelObjectIDs: string[];
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let initialChannelCount = 0;
    let newChannelObjectID: string;
    it('1. Initialize', async () => {
      initialChannelObjectIDs = (await Channel.find().exec()).map((item: any) => item.id);
      initialChannelCount = await Channel.countDocuments();
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      initialGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      initialGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;
    }, 30000);
    it('2. Create Channel', async () => {
      const {result} = await api.createChannel(
        {
          input: {
            name: 'test create channel',
            description: 'test channel',
            channelGroupID: channelGroup,
            type: 'Public',
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );
      newChannelObjectID = result.objectID!;
      expect(result.objectType).toEqual('Channel');
      expect(result.success).toBeTruthy();
      expect(initialChannelObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Channel entry should be created', async () => {
      const getChannel = await Channel.findById(newChannelObjectID).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('4. Channel can be queried by slug', async () => {
      const getChannel = await Channel.find({
        slug: 'test-create-channel',
      }).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('5. GroupAggregates should be updated', async () => {
      const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      expect(finalGrpAggSportChannelsCount).toEqual(initialGrpAggSportChannelsCount + 1);
      const finalGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      expect(finalGrpAggLeagueChannelsCount).toEqual(initialGrpAggLeagueChannelsCount + 1);
      const finalGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      expect(finalGrpAggClubChannelsCount).toEqual(initialGrpAggClubChannelsCount + 1);
      const finalGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;
      expect(finalGrpAggLockerRoomChannelsCount).toEqual(initialGrpAggLockerRoomChannelsCount + 1);
    }, 30000);
    it('6. Teardown', async () => {
      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channels: -1});
      await GroupAggregates.increment(`League:${league}`, {channels: -1});
      await GroupAggregates.increment(`Club:${club}`, {channels: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channels: -1});
      const finalChannelCount = await Channel.countDocuments();

      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();
      expect(finalChannelCount).toEqual(initialChannelCount);
      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggClubChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLockerRoomChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channels!
      );
    }, 30000);
  });
  describe('13. Test Edit of Channel', () => {
    let initialChannelObjectIDs: string[];
    let initialChannelCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let newChannelObjectID: string;
    let newChannelSlug: string;
    let channelObjectIDsAfterAdding: string[];
    let channelCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelCount = await Channel.countDocuments();
      initialChannelObjectIDs = (await Channel.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      initialGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      initialGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;

      newChannelObjectID = (
        await api.createChannel(
          {
            input: {
              name: 'test edit channel',
              description: 'test channel',
              channelGroupID: channelGroup,
              type: 'Public',
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelObjectIDsAfterAdding = (await Channel.find().exec()).map((item: any) => item.id);
      channelCountAfterAdding = await Channel.countDocuments();
      newChannelSlug = (await Channel.findById(newChannelObjectID).exec())!.slug!;
      expect(initialChannelObjectIDs.includes(newChannelObjectID)).toBeFalsy();
      expect(initialChannelCount + 1).toEqual(channelCountAfterAdding);
    }, 30000);
    it('2. Edit Channel', async () => {
      const {result} = await api.editChannel(
        {
          id: newChannelObjectID,
          input: {
            name: 'test channel edit - edited',
            description: 'test channel',
            type: 'Public',
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );

      expect(result.objectType).toEqual('Channel');
      expect(result.success).toBeTruthy();
      expect(channelObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Channel entry should be retained', async () => {
      const getChannel = await Channel.findById(newChannelObjectID).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('4. Channel entry name should be edited', async () => {
      const getChannel = await Channel.findById(newChannelObjectID).exec();
      expect(getChannel?.name).toEqual('test channel edit - edited');
    }, 30000);
    it('5. Channel entry slug should be unchanged', async () => {
      const getChannel = await Channel.findOne({slug: newChannelSlug}).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('6. Channel collection document count should not increment', async () => {
      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(channelCountAfterAdding);
    }, 30000);
    it('7. GroupAggregates should not be updated', async () => {
      const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      expect(finalGrpAggSportChannelsCount).toEqual(initialGrpAggSportChannelsCount + 1);
      const finalGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      expect(finalGrpAggLeagueChannelsCount).toEqual(initialGrpAggLeagueChannelsCount + 1);
      const finalGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      expect(finalGrpAggClubChannelsCount).toEqual(initialGrpAggClubChannelsCount + 1);
      const finalGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;
      expect(finalGrpAggLockerRoomChannelsCount).toEqual(initialGrpAggLockerRoomChannelsCount + 1);
    }, 30000);
    it('8. Teardown', async () => {
      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channels: -1});
      await GroupAggregates.increment(`League:${league}`, {channels: -1});
      await GroupAggregates.increment(`Club:${club}`, {channels: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channels: -1});
      const finalChannelCount = await Channel.countDocuments();

      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();
      expect(finalChannelCount).toEqual(initialChannelCount);
      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggClubChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLockerRoomChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channels!
      );
    }, 30000);
  });
  describe('14. Test Querying of Channel', () => {
    it('1. Channel can be queried by id', async () => {
      const {result} = await api.getChannel({
        id: channelObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Channel can be queried by slug', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getChannel({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All Channel can be queried', async () => {
      const {result} = await api.getChannels();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
  describe('15. Test Deletion of Channel', () => {
    let initialChannelObjectIDs: string[];
    let initialChannelCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let newChannelObjectID: string;
    let newChannelSlug: string;
    let channelObjectIDsAfterAdding: string[];
    let channelCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelCount = await Channel.countDocuments();
      initialChannelObjectIDs = (await Channel.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      initialGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      initialGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;

      newChannelObjectID = (
        await api.createChannel(
          {
            input: {
              name: 'test delete channel',
              description: 'test channel',
              channelGroupID: channelGroup,
              type: 'Public',
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelObjectIDsAfterAdding = (await Channel.find().exec()).map((item: any) => item.id);
      channelCountAfterAdding = await Channel.countDocuments();
      newChannelSlug = (await Channel.findById(newChannelObjectID).exec())!.slug!;
      expect(initialChannelObjectIDs.includes(newChannelObjectID)).toBeFalsy();
      expect(initialChannelCount + 1).toEqual(channelCountAfterAdding);
    }, 30000);
    it('2. Channel should not be the last channel of the locker room', async () => {
      const result = (await Channel.find({isDeleted: false, channelGroupID: channelGroup}).exec()).map(
        (item: ChannelDocument) => item.slug
      );
      expect(result.length).toBeGreaterThan(1);
    }, 30000);
    it('3. Delete Channel', async () => {
      const {result} = await api.deleteChannel(
        {
          id: newChannelObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('Channel');
      expect(result.success).toBeTruthy();
      expect(channelObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('4. Deleted Channel can not be queried using ID', async () => {
      const {result} = await api.getChannel({
        id: newChannelObjectID,
      });
      expect(result).toBeNull();
    }, 30000);
    it('5. Deleted Channel can not be queried using slug', async () => {
      const {result} = await api.getChannel({
        slug: newChannelSlug,
      });
      expect(result).toBeNull();
    }, 30000);
    it('6. Deleted Channel is marked as isDeleted in database', async () => {
      const getChannel = await Channel.findOne({id: newChannelObjectID, isDeleted: true}).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('7. Channel collection document count should still include the deleted Channel', async () => {
      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(channelCountAfterAdding);
    }, 30000);
    it('8. GroupAggregates should be updated to remove the deleted Channel count', async () => {
      const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      expect(finalGrpAggSportChannelsCount).toEqual(initialGrpAggSportChannelsCount);
      const finalGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      expect(finalGrpAggLeagueChannelsCount).toEqual(initialGrpAggLeagueChannelsCount);
      const finalGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      expect(finalGrpAggClubChannelsCount).toEqual(initialGrpAggClubChannelsCount);
      const finalGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;
      expect(finalGrpAggLockerRoomChannelsCount).toEqual(initialGrpAggLockerRoomChannelsCount);
    }, 30000);
    it('9. Teardown', async () => {
      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();

      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(initialChannelCount);

      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggClubChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLockerRoomChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channels!
      );
    }, 30000);
  });
  describe('16. Test Undo Deletion of Channel', () => {
    let initialChannelObjectIDs: string[];
    let initialChannelCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let newChannelObjectID: string;
    let newChannelSlug: string;
    let channelObjectIDsAfterAdding: string[];
    let channelCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelCount = await Channel.countDocuments();
      initialChannelObjectIDs = (await Channel.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      initialGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      initialGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;

      newChannelObjectID = (
        await api.createChannel(
          {
            input: {
              name: 'test undo delete channel',
              description: 'test channel',
              channelGroupID: channelGroup,
              type: 'Public',
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelObjectIDsAfterAdding = (await Channel.find().exec()).map((item: any) => item.id);
      channelCountAfterAdding = await Channel.countDocuments();
      newChannelSlug = (await Channel.findById(newChannelObjectID).exec())!.slug!;
      expect(initialChannelObjectIDs.includes(newChannelObjectID)).toBeFalsy();
      expect(initialChannelCount + 1).toEqual(channelCountAfterAdding);
    }, 30000);
    it('2. Delete Channel', async () => {
      const {result} = await api.deleteChannel(
        {
          id: newChannelObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('Channel');
      expect(result.success).toBeTruthy();
      expect(channelObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Channel count should not reach the maximum count (30) to proceed for Undo Delete action', async () => {
      const result = (await Channel.find({isDeleted: false, channelGroupID: channelGroup}).exec()).map(
        (item: ChannelDocument) => item.slug
      );
      expect(result.length).toBeLessThan(30);
    }, 30000);
    it('4. Undo Deletion of the Channel', async () => {
      const {result} = await api.undeleteChannel(
        {
          id: newChannelObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('Channel');
      expect(result.success).toBeTruthy();
      expect(channelObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('5. Channel can be queried using ID', async () => {
      const {result} = await api.getChannel({
        id: newChannelObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('6. Channel can be queried using slug', async () => {
      const {result} = await api.getChannel({
        slug: newChannelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('7. Channel is marked as not isDeleted in database', async () => {
      const getChannel = await Channel.findOne({id: newChannelObjectID, isDeleted: false}).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('8. Channel collection document count should include the Channel', async () => {
      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(channelCountAfterAdding);
    }, 30000);
    it('9. GroupAggregates should be updated to add the Channel count', async () => {
      const finalGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      expect(finalGrpAggSportChannelsCount).toEqual(initialGrpAggSportChannelsCount + 1);
      const finalGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      expect(finalGrpAggLeagueChannelsCount).toEqual(initialGrpAggLeagueChannelsCount + 1);
      const finalGrpAggClubChannelsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channels!;
      expect(finalGrpAggClubChannelsCount).toEqual(initialGrpAggClubChannelsCount + 1);
      const finalGrpAggLockerRoomChannelsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channels!;
      expect(finalGrpAggLockerRoomChannelsCount).toEqual(initialGrpAggLockerRoomChannelsCount + 1);
    }, 30000);
    it('10. Teardown', async () => {
      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channels: -1});
      await GroupAggregates.increment(`League:${league}`, {channels: -1});
      await GroupAggregates.increment(`Club:${club}`, {channels: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channels: -1});

      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(initialChannelCount);

      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggClubChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLockerRoomChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channels!
      );
    }, 30000);
  });
};
