// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {
  ChannelGroup,
  GroupAggregates,
  Sport,
  League,
  Club,
  LockerRoom,
  ChannelGroupDocument,
  Channel,
} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
let channelGroupObjectID: string;
let channelGroupSlug: string;
let sportGroup: string;
let league: string;
let club: string;
let lockerRoom: string;
export {connection} from 'mongoose';
const emailAddress = 'automatedtester1@fx1.io';
const password = 'p588w012D';

beforeAll(async () => {
  const client = new GraphQLClient(url);
  // @ts-ignore
  firebaseApp = initializeApp(firebaseConfig[global.appEnv]);
  const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress, password);
  authToken = await user.getIdToken(true);
  api = getSdk(client);
  channelGroupObjectID = (await ChannelGroup.find().exec())[0].id;
  channelGroupSlug = (await ChannelGroup.findById(channelGroupObjectID).exec())!.slug!;
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
});

export default () => {
  describe('7. Test Create of ChannelGroup', () => {
    let initialChannelGroupObjectIDs: string[];
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggClubChannelGroupsCount = 0;
    let initialGrpAggLockerRoomChannelGroupsCount = 0;
    let newChannelGroupObjectID: string;
    it('1. Initialize', async () => {
      initialChannelGroupObjectIDs = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      initialGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;
    }, 30000);
    it('2. Create Channel Group', async () => {
      const {result} = await api.createChannelGroup(
        {
          input: {
            name: 'test create channel group',
            description: 'test channel group',
            lockerRoomID: lockerRoom,
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );
      newChannelGroupObjectID = result.objectID!;
      expect(result.objectType).toEqual('ChannelGroup');
      expect(result.success).toBeTruthy();
      expect(initialChannelGroupObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Channel Group entry should be created', async () => {
      const getChannelGroup = await ChannelGroup.findById(newChannelGroupObjectID).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('4. Channel Group can be queried by slug', async () => {
      const getChannelGroup = await ChannelGroup.find({
        slug: 'test-create-channel-group',
      }).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('5. GroupAggregates should be updated', async () => {
      const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggSportChannelGroupsCount).toEqual(initialGrpAggSportChannelGroupsCount + 1);
      const finalGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLeagueChannelGroupsCount).toEqual(initialGrpAggLeagueChannelGroupsCount + 1);
      const finalGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggClubChannelGroupsCount).toEqual(initialGrpAggClubChannelGroupsCount + 1);
      const finalGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLockerRoomChannelGroupsCount).toEqual(initialGrpAggLockerRoomChannelGroupsCount + 1);
    }, 30000);
    it('6. Teardown', async () => {
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channelGroups: -1});
      await GroupAggregates.increment(`League:${league}`, {channelGroups: -1});
      await GroupAggregates.increment(`Club:${club}`, {channelGroups: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channelGroups: -1});

      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggClubChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLockerRoomChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channelGroups!
      );
    }, 30000);
  });
  describe('8. Test Edit of ChannelGroup', () => {
    let initialChannelGroupObjectIDs: string[];
    let initialChannelGroupCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggClubChannelGroupsCount = 0;
    let initialGrpAggLockerRoomChannelGroupsCount = 0;
    let newChannelGroupObjectID: string;
    let newChannelGroupSlug: string;
    let channelGroupObjectIDsAfterAdding: string[];
    let channelGroupCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelGroupObjectIDs = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      initialGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;

      newChannelGroupObjectID = (
        await api.createChannelGroup(
          {
            input: {
              name: 'test edit channel group',
              description: 'test channel group',
              lockerRoomID: lockerRoom,
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelGroupObjectIDsAfterAdding = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      channelGroupCountAfterAdding = await ChannelGroup.countDocuments();
      newChannelGroupSlug = (await ChannelGroup.findById(newChannelGroupObjectID).exec())!.slug!;
      expect(initialChannelGroupObjectIDs.includes(newChannelGroupObjectID)).toBeFalsy();
      expect(initialChannelGroupCount + 1).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('2. Edit ChannelGroup', async () => {
      const {result} = await api.editChannelGroup(
        {
          id: newChannelGroupObjectID,
          input: {
            name: 'test edit channel group - edited',
            description: 'test channel group',
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );

      expect(result.objectType).toEqual('ChannelGroup');
      expect(result.success).toBeTruthy();
      expect(channelGroupObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. ChannelGroup entry should be retained', async () => {
      const getChannelGroup = await ChannelGroup.findById(newChannelGroupObjectID).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('4. ChannelGroup entry name should be edited', async () => {
      const getChannelGroup = await ChannelGroup.findById(newChannelGroupObjectID).exec();
      expect(getChannelGroup?.name).toEqual('test edit channel group - edited');
    }, 30000);
    it('5. ChannelGroup entry slug should be unchanged', async () => {
      const getChannelGroup = await ChannelGroup.findOne({slug: newChannelGroupSlug}).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('6. ChannelGroup collection document count should not increment', async () => {
      const finalChannelGroupCount = await ChannelGroup.countDocuments();
      expect(finalChannelGroupCount).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('7. GroupAggregates should not be updated', async () => {
      const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggSportChannelGroupsCount).toEqual(initialGrpAggSportChannelGroupsCount + 1);
      const finalGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLeagueChannelGroupsCount).toEqual(initialGrpAggLeagueChannelGroupsCount + 1);
      const finalGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggClubChannelGroupsCount).toEqual(initialGrpAggClubChannelGroupsCount + 1);
      const finalGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLockerRoomChannelGroupsCount).toEqual(initialGrpAggLockerRoomChannelGroupsCount + 1);
    }, 30000);
    it('8. Teardown', async () => {
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channelGroups: -1});
      await GroupAggregates.increment(`League:${league}`, {channelGroups: -1});
      await GroupAggregates.increment(`Club:${club}`, {channelGroups: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channelGroups: -1});
      const finalChannelGroupCount = await ChannelGroup.countDocuments();

      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();
      expect(finalChannelGroupCount).toEqual(initialChannelGroupCount);
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggClubChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLockerRoomChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channelGroups!
      );
    }, 30000);
  });
  describe('9. Test Querying of ChannelGroup', () => {
    it('1. ChannelGroup can be queried by id', async () => {
      const {result} = await api.getChannelGroup({
        id: channelGroupObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. ChannelGroup can be queried by slug', async () => {
      const {result} = await api.getChannelGroup({
        slug: channelGroupSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getChannelGroup({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All channelGroup can be queried', async () => {
      const {result} = await api.getChannelGroups();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
  describe('10. Test Deletion of ChannelGroup', () => {
    let initialChannelGroupObjectIDs: string[];
    let initialChannelGroupCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggClubChannelGroupsCount = 0;
    let initialGrpAggLockerRoomChannelGroupsCount = 0;
    let newChannelGroupObjectID: string;
    let newChannelGroupSlug: string;
    let channelGroupObjectIDsAfterAdding: string[];
    let channelGroupCountAfterAdding = 0;
    let initialChannelCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let newChannelObjectID: string;
    let newChannelSlug: string;
    let channelCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialChannelGroupObjectIDs = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      initialGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;

      newChannelGroupObjectID = (
        await api.createChannelGroup(
          {
            input: {
              name: 'test delete channel group',
              description: 'test channel group',
              lockerRoomID: lockerRoom,
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelGroupObjectIDsAfterAdding = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      channelGroupCountAfterAdding = await ChannelGroup.countDocuments();
      newChannelGroupSlug = (await ChannelGroup.findById(newChannelGroupObjectID).exec())!.slug!;

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
              name: 'test delete channel group channel',
              description: 'test channel',
              channelGroupID: newChannelGroupObjectID,
              type: 'Public',
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      newChannelSlug = (await Channel.findById(newChannelObjectID).exec())!.slug!;
      channelCountAfterAdding = await Channel.countDocuments();
      expect(initialChannelGroupObjectIDs.includes(newChannelGroupObjectID)).toBeFalsy();
      expect(initialChannelGroupCount + 1).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('2. ChannelGroup should not be the last channelGroup of the locker room', async () => {
      const result = (await ChannelGroup.find({isDeleted: false, lockerRoomID: lockerRoom}).exec()).map(
        (item: ChannelGroupDocument) => item.slug
      );
      expect(result.length).toBeGreaterThan(1);
    }, 30000);
    it('3. Delete Channel Group', async () => {
      const {result} = await api.deleteChannelGroup(
        {
          id: newChannelGroupObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('ChannelGroup');
      expect(result.success).toBeTruthy();
      expect(channelGroupObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('4. Deleted ChannelGroup can not be queried using ID', async () => {
      const {result} = await api.getChannelGroup({
        id: newChannelGroupObjectID,
      });
      expect(result).toBeNull();
    }, 30000);
    it('5. Deleted ChannelGroup can not be queried using slug', async () => {
      const {result} = await api.getChannelGroup({
        slug: newChannelGroupSlug,
      });
      expect(result).toBeNull();
    }, 30000);
    it('6. Deleted ChannelGroup is marked as isDeleted in database', async () => {
      const getChannelGroup = await ChannelGroup.findOne({id: newChannelGroupObjectID, isDeleted: true}).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('7. ChannelGroup collection document count should still include the deleted ChannelGroup', async () => {
      const finalChannelGroupCount = await ChannelGroup.countDocuments();
      expect(finalChannelGroupCount).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('8. Channel belonging to Deleted ChannelGroup can not be queried using ID', async () => {
      const {result} = await api.getChannel({
        id: newChannelObjectID,
      });
      expect(result).toBeNull();
    }, 30000);
    it('9. Channel belonging to Deleted ChannelGroup can not be queried using slug', async () => {
      const {result} = await api.getChannel({
        slug: newChannelSlug,
      });
      expect(result).toBeNull();
    }, 30000);
    it('10. Channel belonging to Deleted ChannelGroup is marked as isDeleted in database', async () => {
      const getChannel = await Channel.findOne({id: newChannelObjectID, isDeleted: true}).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('11. Channel collection document count should still include the deleted Channel', async () => {
      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(channelCountAfterAdding);
    }, 30000);
    it('12. GroupAggregates should be updated to remove the deleted ChannelGroup count', async () => {
      const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggSportChannelGroupsCount).toEqual(initialGrpAggSportChannelGroupsCount);
      const finalGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLeagueChannelGroupsCount).toEqual(initialGrpAggLeagueChannelGroupsCount);
      const finalGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggClubChannelGroupsCount).toEqual(initialGrpAggClubChannelGroupsCount);
      const finalGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLockerRoomChannelGroupsCount).toEqual(initialGrpAggLockerRoomChannelGroupsCount);
    }, 30000);
    it('13. GroupAggregates should be updated to remove the channels under the deleted ChannelGroup count', async () => {
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
    it('14. Teardown', async () => {
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();

      const finalChannelGroupCount = await ChannelGroup.countDocuments();
      expect(finalChannelGroupCount).toEqual(initialChannelGroupCount);

      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();

      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(initialChannelCount);

      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggClubChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLockerRoomChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channelGroups!
      );

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
  describe('11. Test Undo Deletion of ChannelGroup', () => {
    let initialChannelGroupObjectIDs: string[];
    let initialChannelGroupCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggClubChannelGroupsCount = 0;
    let initialGrpAggLockerRoomChannelGroupsCount = 0;
    let newChannelGroupObjectID: string;
    let newChannelGroupSlug: string;
    let channelGroupObjectIDsAfterAdding: string[];
    let channelGroupCountAfterAdding = 0;
    let initialChannelCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggClubChannelsCount = 0;
    let initialGrpAggLockerRoomChannelsCount = 0;
    let newChannelObjectID: string;
    let newChannelSlug: string;
    let channelCountAfterAdding = 0;
    it('1. Initialize', async () => {
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialChannelGroupObjectIDs = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      initialGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;

      newChannelGroupObjectID = (
        await api.createChannelGroup(
          {
            input: {
              name: 'test delete channel group',
              description: 'test channel group',
              lockerRoomID: lockerRoom,
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      channelGroupObjectIDsAfterAdding = (await ChannelGroup.find().exec()).map((item: any) => item.id);
      channelGroupCountAfterAdding = await ChannelGroup.countDocuments();
      newChannelGroupSlug = (await ChannelGroup.findById(newChannelGroupObjectID).exec())!.slug!;

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
              channelGroupID: newChannelGroupObjectID,
              type: 'Public',
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;

      newChannelSlug = (await Channel.findById(newChannelObjectID).exec())!.slug!;
      channelCountAfterAdding = await Channel.countDocuments();
      expect(initialChannelGroupObjectIDs.includes(newChannelGroupObjectID)).toBeFalsy();
      expect(initialChannelGroupCount + 1).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('2. Delete Channel Group', async () => {
      const {result} = await api.deleteChannelGroup(
        {
          id: newChannelGroupObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('ChannelGroup');
      expect(result.success).toBeTruthy();
      expect(channelGroupObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Undo Deletion of the ChannelGroup', async () => {
      const {result} = await api.undeleteChannelGroup(
        {
          id: newChannelGroupObjectID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('ChannelGroup');
      expect(result.success).toBeTruthy();
      expect(channelGroupObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);

    it('4. ChannelGroup can be queried using ID', async () => {
      const {result} = await api.getChannelGroup({
        id: newChannelGroupObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('5. ChannelGroup can be queried using slug', async () => {
      const {result} = await api.getChannelGroup({
        slug: newChannelGroupSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('6. ChannelGroup is marked as not isDeleted in database', async () => {
      const getChannelGroup = await ChannelGroup.findOne({id: newChannelGroupObjectID, isDeleted: false}).exec();
      expect(getChannelGroup).not.toBeNull();
    }, 30000);
    it('7. ChannelGroup collection document count should include the ChannelGroup', async () => {
      const finalChannelGroupCount = await ChannelGroup.countDocuments();
      expect(finalChannelGroupCount).toEqual(channelGroupCountAfterAdding);
    }, 30000);
    it('8. Channel belonging to the ChannelGroup can be queried using ID', async () => {
      const {result} = await api.getChannel({
        id: newChannelObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('9. Channel belonging to the ChannelGroup can be queried using slug', async () => {
      const {result} = await api.getChannel({
        slug: newChannelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('10. Channel belonging to the ChannelGroup is marked as not isDeleted in database', async () => {
      const getChannel = await Channel.findOne({id: newChannelObjectID, isDeleted: false}).exec();
      expect(getChannel).not.toBeNull();
    }, 30000);
    it('11. Channel collection document count should still include the Channel', async () => {
      const finalChannelCount = await Channel.countDocuments();
      expect(finalChannelCount).toEqual(channelCountAfterAdding);
    }, 30000);
    it('12. GroupAggregates should be updated to add the ChannelGroup count', async () => {
      const finalGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggSportChannelGroupsCount).toEqual(initialGrpAggSportChannelGroupsCount + 1);
      const finalGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLeagueChannelGroupsCount).toEqual(initialGrpAggLeagueChannelGroupsCount + 1);
      const finalGrpAggClubChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggClubChannelGroupsCount).toEqual(initialGrpAggClubChannelGroupsCount + 1);
      const finalGrpAggLockerRoomChannelGroupsCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.channelGroups!;
      expect(finalGrpAggLockerRoomChannelGroupsCount).toEqual(initialGrpAggLockerRoomChannelGroupsCount + 1);
    }, 30000);
    it('13. GroupAggregates should be updated to add the channels', async () => {
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
    it('14. Teardown', async () => {
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.findByIdAndDelete(newChannelObjectID).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channelGroups: -1});
      await GroupAggregates.increment(`League:${league}`, {channelGroups: -1});
      await GroupAggregates.increment(`Club:${club}`, {channelGroups: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channelGroups: -1});
      await GroupAggregates.increment(`Sport:${sportGroup}`, {channels: -1});
      await GroupAggregates.increment(`League:${league}`, {channels: -1});
      await GroupAggregates.increment(`Club:${club}`, {channels: -1});
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {channels: -1});

      const finalChannelGroupCount = await ChannelGroup.countDocuments();

      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();
      expect(await Channel.findById(newChannelObjectID).exec()).toBeNull();
      expect(finalChannelGroupCount).toEqual(initialChannelGroupCount);
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggClubChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLockerRoomChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.channelGroups!
      );

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
