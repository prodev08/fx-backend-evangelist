// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {
  Channel,
  ChannelGroup,
  Club,
  GroupAggregates,
  League,
  LockerRoom,
  Sport,
  User,
  UserAggregates,
  UserRole,
} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
const emailAddress = 'automatedtester1@fx1.io';
const password = 'p588w012D';

let clubObjectID: string;
let clubSlug: string;
let sportGroup: string;
let league: string;
let userID: string;
let uid: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  // @ts-ignore
  firebaseApp = initializeApp(firebaseConfig[global.appEnv]);
  const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress, password);
  authToken = await user.getIdToken(true);
  const client = new GraphQLClient(url);
  api = getSdk(client);
  clubObjectID = (await Club.find().exec())[0].id;
  clubSlug = (await Club.findById(clubObjectID).exec())!.slug!;
  sportGroup = (await Sport.find().exec())[0].id;
  league = (await League.findOne({
    sportIDs: `${sportGroup}`,
  }).exec())!.id!;
  ({id: userID, uid} = (await User.findOne({emailAddress}).exec())!);
});

export default () => {
  describe('3. Test Querying of Club', () => {
    it('1. Club can be queried by id', async () => {
      const {result} = await api.getClub({
        id: clubObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Club can be queried by slug', async () => {
      const {result} = await api.getClub({
        slug: clubSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getClub({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All club can be queried', async () => {
      const {result} = await api.getClubs();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
  describe('4. Test Creation of Club', () => {
    let initialClubObjectIDs: string[];
    let initialSportCount = 0;
    let initialLeagueCount = 0;
    let initialClubCount = 0;
    let initialLockerRoomCount = 0;
    let initialChannelGroupCount = 0;
    let initialChannelCount = 0;
    let initialUserRoleCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportClubsCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggSportSupportersCount = 0;
    let initialGrpAggLeagueClubsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggLeagueSupportersCount = 0;
    let newClubObjectID: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;
    let newUserRoleObjectID: string;
    let defaultUserID: string;
    it('1. Initialize', async () => {
      initialClubObjectIDs = (await Club.find().exec()).map((item: any) => item.id);
      initialSportCount = await Sport.countDocuments();
      initialLeagueCount = await League.countDocuments();
      initialClubCount = await Club.countDocuments();
      initialLockerRoomCount = await LockerRoom.countDocuments();
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialUserRoleCount = await UserRole.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();
      initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.clubs!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.supporters!;
      initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.clubs!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;
      initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.supporters!;
      defaultUserID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
    }, 30000);
    it('2. Create Club', async () => {
      const {result} = await api.createClub(
        {
          input: {
            Avatar: null,
            CoverPhoto: null,
            leagueID: league,
            name: 'test create club',
            sportIDs: [sportGroup],
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );
      newClubObjectID = result.objectID!;
      expect(result.objectType).toEqual('Club');
      expect(result.success).toBeTruthy();
      expect(initialClubObjectIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Club entry should be created', async () => {
      const getNewClub = await Club.findById(newClubObjectID).exec();
      expect(getNewClub).not.toBeNull();
    }, 30000);
    it("4. Club collection's documents should increment by at least 1", async () => {
      const finalClubCount = await Club.countDocuments();
      expect(finalClubCount).toBeGreaterThan(initialClubCount);
    }, 30000);
    it('5. Default Locker Room should be created', async () => {
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(defaultLockerRoom).not.toBeNull();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
    }, 30000);
    it('6. Default ChannelGroup should be created', async () => {
      const defaultChannelInformation = await ChannelGroup.findOne({
        name: 'Information',
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(defaultChannelInformation).not.toBeNull();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
    }, 30000);
    it('7. Default Channels should be created', async () => {
      const defaultChannelGeneral = await Channel.findOne({
        name: 'General',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      const defaultChannelAnnouncements = await Channel.findOne({
        name: 'Announcements',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      const defaultChannelInjuries = await Channel.findOne({
        name: 'Injuries',
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      expect(defaultChannelGeneral).not.toBeNull();
      expect(defaultChannelAnnouncements).not.toBeNull();
      expect(defaultChannelInjuries).not.toBeNull();
    }, 30000);
    it('8. UserRole as owner with isPrimaryOwner set to true should be created', async () => {
      const findUserRole = await UserRole.findOne({
        group: `Club:${newClubObjectID}`,
        role: 'owner',
        isPrimaryOwner: true,
      }).exec();
      expect(findUserRole).not.toBeNull();
      expect(findUserRole?.groupType).toEqual('Club');
      expect(findUserRole?.groupID).toEqual(newClubObjectID);
      expect(findUserRole?.userID).toEqual(userID);
      expect(findUserRole?.uid).toEqual(uid);
      newUserRoleObjectID = findUserRole?.id;
    }, 30000);
    it("9. GroupAggregates of chosen sport's club should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggSportClubsCount + 1);
    }, 30000);
    it("10. GroupAggregates of chosen sport's channel group should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(initialGrpAggSportChannelGroupsCount + 1).toEqual(findGroupAggregates?.channelGroups);
    }, 30000);
    it("11. GroupAggregates of chosen sport's channel should increment by 3", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(initialGrpAggSportChannelsCount + 3).toEqual(findGroupAggregates?.channels);
    }, 30000);
    it("12. GroupAggregates of chosen sport's supporters should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggSportSupportersCount + 1);
    }, 30000);
    it("13. GroupAggregates of chosen league's club should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggLeagueClubsCount + 1);
    }, 30000);
    it("14. GroupAggregates of chosen league's channel group should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(initialGrpAggLeagueChannelGroupsCount + 1).toEqual(findGroupAggregates?.channelGroups);
    }, 30000);
    it("15. GroupAggregates of chosen league's channel should increment by 3", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(initialGrpAggLeagueChannelsCount + 3).toEqual(findGroupAggregates?.channels);
    }, 30000);
    it("16. GroupAggregates of chosen league's supporters should increment by 1", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLeagueSupportersCount + 1);
    }, 30000);
    it('17. GroupAggregates of Club should be created', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
      expect(findGroupAggregates?.channelGroups).toEqual(1);
      expect(findGroupAggregates?.channels).toEqual(3);
    }, 30000);
    it('18. GroupAggregates of Club Locker Room should be created', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `LockerRoom:${newLockerRoomObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
      expect(findGroupAggregates?.channelGroups).toEqual(1);
      expect(findGroupAggregates?.channels).toEqual(3);
    }, 30000);
    it('19. Teardown', async () => {
      await Club.findByIdAndDelete(newClubObjectID).exec();
      await GroupAggregates.deleteMany({
        $or: [{group: `LockerRoom:${newLockerRoomObjectID}`}, {group: `Club:${newClubObjectID}`}],
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
        supporters: -1,
      });
      await GroupAggregates.increment(`League:${league}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
        supporters: -1,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      await UserRole.deleteMany({group: `Club:${newClubObjectID}`});
      await UserAggregates.increment(defaultUserID, {
        supports: -1,
      });
      expect(await Sport.countDocuments()).toEqual(initialSportCount);
      expect(await League.countDocuments()).toEqual(initialLeagueCount);
      expect(await Club.countDocuments()).toEqual(initialClubCount);
      expect(await LockerRoom.countDocuments()).toEqual(initialLockerRoomCount);
      expect(await ChannelGroup.countDocuments()).toEqual(initialChannelGroupCount);
      expect(await Channel.countDocuments()).toEqual(initialChannelCount);
      expect(await UserRole.countDocuments()).toEqual(initialUserRoleCount);
      expect(await GroupAggregates.countDocuments()).toEqual(initialGroupAggregatesCount);
      expect(initialGrpAggSportClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggSportChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggSportChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggSportSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueClubsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggLeagueChannelGroupsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelsCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(await Club.findById(newClubObjectID).exec()).toBeNull();
      expect(await LockerRoom.findById(newLockerRoomObjectID).exec()).toBeNull();
      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();
      expect((await Channel.find({channelGroupID: newChannelGroupObjectID}).exec()).length).toEqual(0);
      expect(await UserRole.findById(newUserRoleObjectID).exec()).toBeNull();
    }, 30000);
  });
  describe('5. Test Editing of Club', () => {
    let initialSportCount = 0;
    let initialLeagueCount = 0;
    let initialClubCount = 0;
    let initialLockerRoomCount = 0;
    let initialChannelGroupCount = 0;
    let initialChannelCount = 0;
    let initialUserRoleCount = 0;
    let initialGroupAggregatesCount = 0;
    let initialGrpAggSportClubsCount = 0;
    let initialGrpAggSportChannelGroupsCount = 0;
    let initialGrpAggSportChannelsCount = 0;
    let initialGrpAggSportSupportersCount = 0;
    let initialGrpAggLeagueClubsCount = 0;
    let initialGrpAggLeagueChannelGroupsCount = 0;
    let initialGrpAggLeagueChannelsCount = 0;
    let initialGrpAggLeagueSupportersCount = 0;
    let newClubObjectID: string;
    let newClubSlug: string;
    let newLockerRoomObjectID: string;
    let newChannelGroupObjectID: string;
    let newUserRoleObjectID: string;
    let defaultUserID: string;
    let clubObjectIDsAfterAdding: string[];
    let clubCountAfterAdding = 0;

    it('1. Initialize', async () => {
      initialUserRoleCount = await UserRole.countDocuments();
      initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.supporters!;
      initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.supporters!;
      defaultUserID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
      newClubObjectID = (
        await api.createClub(
          {
            input: {
              Avatar: null,
              CoverPhoto: null,
              leagueID: league,
              name: 'test club edit',
              sportIDs: [sportGroup],
            },
          },
          {Authorization: `Bearer ${authToken}`}
        )
      ).result.objectID!;
      initialSportCount = await Sport.countDocuments();
      initialLeagueCount = await League.countDocuments();
      initialClubCount = await Club.countDocuments();
      initialLockerRoomCount = await LockerRoom.countDocuments();
      initialChannelGroupCount = await ChannelGroup.countDocuments();
      initialChannelCount = await Channel.countDocuments();
      initialGroupAggregatesCount = await GroupAggregates.countDocuments();

      initialGrpAggSportClubsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.clubs!;
      initialGrpAggSportChannelGroupsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channelGroups!;
      initialGrpAggSportChannelsCount = (await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec())!.channels!;
      initialGrpAggLeagueClubsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.clubs!;
      initialGrpAggLeagueChannelGroupsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channelGroups!;
      initialGrpAggLeagueChannelsCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.channels!;

      clubObjectIDsAfterAdding = (await Club.find().exec()).map((item: any) => item.id);
      clubCountAfterAdding = await Club.countDocuments();
      newClubSlug = (await Club.findById(newClubObjectID).exec())!.slug!;
      const defaultLockerRoom = await LockerRoom.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newLockerRoomObjectID = defaultLockerRoom?.id.toString();
      const defaultChannelInformation = await ChannelGroup.findOne({
        group: `Club:${newClubObjectID}`,
      }).exec();
      newChannelGroupObjectID = defaultChannelInformation?.id.toString();
      const findUserRole = await UserRole.findOne({
        group: `Club:${newClubObjectID}`,
        role: 'owner',
        isPrimaryOwner: true,
      }).exec();
      newUserRoleObjectID = findUserRole?.id;
    }, 30000);
    it('2. Edit Club', async () => {
      const {result} = await api.editClub(
        {
          id: newClubObjectID,
          input: {
            name: 'test club edit - edited',
            Avatar: null,
            CoverPhoto: null,
          },
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('Club');
      expect(result.success).toBeTruthy();
      expect(clubObjectIDsAfterAdding.includes(result.objectID!)).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('3. Club entry should be retained', async () => {
      const getClub = await Club.findById(newClubObjectID).exec();
      expect(getClub).not.toBeNull();
    }, 30000);
    it("4. Club entry's name should be edited", async () => {
      const getClub = await Club.findById(newClubObjectID).exec();
      expect(getClub?.name).toEqual('test club edit - edited');
    }, 30000);
    it("5. Club entry's slug should be unchanged", async () => {
      const getClub = await Club.findOne({slug: newClubSlug}).exec();
      expect(getClub).not.toBeNull();
    }, 30000);
    it("6. Club collection's documents should not increment", async () => {
      const finalClubCount = await Club.countDocuments();
      expect(finalClubCount).toEqual(clubCountAfterAdding);
    }, 30000);
    it("7. GroupAggregates of chosen sport's club should not increment", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportGroup}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggSportClubsCount);
      expect(findGroupAggregates?.channelGroups).toEqual(initialGrpAggSportChannelGroupsCount);
      expect(findGroupAggregates?.channels).toEqual(initialGrpAggSportChannelsCount);
    }, 30000);
    it("8. GroupAggregates of created league's club should not increment", async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.clubs).toEqual(initialGrpAggLeagueClubsCount);
      expect(findGroupAggregates?.channelGroups).toEqual(initialGrpAggLeagueChannelGroupsCount);
      expect(findGroupAggregates?.channels).toEqual(initialGrpAggLeagueChannelsCount);
    }, 30000);
    it('9. GroupAggregates should be retained', async () => {
      const findGroupAggregates = await GroupAggregates.find({
        group: `Club:${newClubObjectID}`,
      }).exec();
      expect(findGroupAggregates).not.toBeNull();
    }, 30000);
    it('10. Teardown', async () => {
      await Club.findByIdAndDelete(newClubObjectID).exec();
      await GroupAggregates.deleteMany({
        $or: [{group: `LockerRoom:${newLockerRoomObjectID}`}, {group: `Club:${newClubObjectID}`}],
      }).exec();
      await GroupAggregates.increment(`Sport:${sportGroup}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
        supporters: -1,
      });
      await GroupAggregates.increment(`League:${league}`, {
        clubs: -1,
        channelGroups: -1,
        channels: -3,
        supporters: -1,
      });
      await LockerRoom.findByIdAndDelete(newLockerRoomObjectID).exec();
      await ChannelGroup.findByIdAndDelete(newChannelGroupObjectID).exec();
      await Channel.deleteMany({
        channelGroupID: newChannelGroupObjectID,
      }).exec();
      await UserRole.deleteMany({group: `Club:${newClubObjectID}`});
      await UserAggregates.increment(defaultUserID, {
        supports: -1,
      });
      expect(await Sport.countDocuments()).toEqual(initialSportCount);
      expect(await League.countDocuments()).toEqual(initialLeagueCount);
      expect(await Club.countDocuments()).toEqual(initialClubCount - 1);
      expect(await LockerRoom.countDocuments()).toEqual(initialLockerRoomCount - 1);
      expect(await ChannelGroup.countDocuments()).toEqual(initialChannelGroupCount - 1);
      expect(await Channel.countDocuments()).toEqual(initialChannelCount - 3);
      expect(await UserRole.countDocuments()).toEqual(initialUserRoleCount);
      expect(await GroupAggregates.countDocuments()).toEqual(initialGroupAggregatesCount - 2);
      expect(initialGrpAggSportClubsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggSportChannelGroupsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggSportChannelsCount - 3).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggSportSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportGroup}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueClubsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.clubs!
      );
      expect(initialGrpAggLeagueChannelGroupsCount - 1).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channelGroups!
      );
      expect(initialGrpAggLeagueChannelsCount - 3).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.channels!
      );
      expect(initialGrpAggLeagueSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(await Club.findById(newClubObjectID).exec()).toBeNull();
      expect(await LockerRoom.findById(newLockerRoomObjectID).exec()).toBeNull();
      expect(await ChannelGroup.findById(newChannelGroupObjectID).exec()).toBeNull();
      expect((await Channel.find({channelGroupID: newChannelGroupObjectID}).exec()).length).toEqual(0);
      expect(await UserRole.findById(newUserRoleObjectID).exec()).toBeNull();
    }, 30000);
  });
};
