// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
//import globalSetup from '../utilities/globalSetup';
import {
  UserRole,
  Sport,
  League,
  Club,
  GroupAggregates,
  UserAggregates,
  LockerRoom,
  User,
  ReadMessage,
} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let authToken2: String;
let api: ReturnType<typeof getSdk>;
let sportObjectID: string;
let league: string;
let club: string;
let lockerRoom: string;
const emailAddress = 'automatedtester3@fx1.io';
const emailAddress2 = 'automatedtester2@fx1.io';
const password = 'p588w012D';
export {connection} from 'mongoose';

beforeAll(async () => {
  //await globalSetup();
  const client = new GraphQLClient(url);
  // @ts-ignore
  firebaseApp = initializeApp(firebaseConfig[global.appEnv]);
  const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress, password);
  authToken = await user.getIdToken(true);
  api = getSdk(client);
  sportObjectID = (await Sport.find().exec())[0].id;
  league = (await League.findOne({
    sportIDs: `${sportObjectID}`,
  }).exec())!.id!;
  club = (await Club.findOne({
    sportIDs: `${sportObjectID}`,
    leagueID: `${league}`,
  }).exec())!.id!;
  lockerRoom = (await LockerRoom.findOne({
    group: `Club:${club}`,
  }).exec())!.id!;
});

export default () => {
  describe('17. Test Support of LockerRoom (Non-Supporter)', () => {
    let initialGrpAggSportSupportersCount = 0;
    let initialGrpAggLeagueSupportersCount = 0;
    let initialGrpAggClubSupportersCount = 0;
    let initialGrpAggLockerRoomSupportersCount = 0;
    let initialUsrAggSupportsCount = 0;
    let initialUserRolesCount = 0;
    let initialUserRoleIDs: string[];
    let defaultUserUID: string;
    let defaultUserID: string;
    it('1. Initialize', async () => {
      initialUserRolesCount = await UserRole.countDocuments();
      initialUserRoleIDs = (await UserRole.find().exec()).map((item: any) => item.id);
      defaultUserUID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.uid!;
      defaultUserID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
      initialUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec())!.supporters!;
      initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.supporters!;
      initialGrpAggClubSupportersCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.supporters!;
      initialGrpAggLockerRoomSupportersCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.supporters!;
    }, 30000);
    it('2. Locker Room should exist', async () => {
      const getLockerRoom = await LockerRoom.findById(lockerRoom).exec();
      expect(getLockerRoom).not.toBeNull();
    }, 30000);
    it('3. Check if record not exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
      }).exec();
      expect(defaultUser).toBeNull();
    }, 30000);
    it('4. Support Locker Room', async () => {
      const {result} = await api.support(
        {
          lockerRoomID: lockerRoom,
        },
        {Authorization: `Bearer ${authToken}`}
      );

      expect(result.objectType).toEqual('Support');
      expect(result.success).toBeTruthy();
      expect(initialUserRoleIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('5. Supporter should exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
      }).exec();
      expect(defaultUser).not.toBeNull();
    }, 30000);
    it('6. UserAggregates should be updated to add the User on the Locker Room supporters', async () => {
      const finalUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      expect(finalUsrAggSupportsCount).toEqual(initialUsrAggSupportsCount + 1);
    }, 30000);
    it('7. GroupAggregates (Sports) should increment by 1 to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggSportSupportersCount + 1);
    }, 30000);
    it('8. GroupAggregates (League) should increment by 1 to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLeagueSupportersCount + 1);
    }, 30000);
    it('9. GroupAggregates (Club) should increment by 1 to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggClubSupportersCount + 1);
    }, 30000);
    it('10. GroupAggregates (Club Locker Room) should increment by 1 to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLockerRoomSupportersCount + 1);
    }, 30000);
    it('11. Record on the ReadMessage Document should be updated', async () => {
      const readMessageUser = await ReadMessage.findOne({
        userID: defaultUserID,
      }).exec();
      expect(readMessageUser).not.toBeNull();
    }, 30000);
    it('12. Teardown', async () => {
      await UserRole.deleteMany({userID: defaultUserID}).exec();
      await ReadMessage.deleteMany({userID: defaultUserID}).exec();
      await UserAggregates.increment(defaultUserID, {
        supports: -1,
      });
      await GroupAggregates.increment(`Sport:${sportObjectID}`, {
        supporters: -1,
      });
      await GroupAggregates.increment(`League:${league}`, {
        supporters: -1,
      });
      await GroupAggregates.increment(`Club:${club}`, {
        supporters: -1,
      });
      await GroupAggregates.increment(`LockerRoom:${lockerRoom}`, {
        supporters: -1,
      });

      expect(await UserRole.countDocuments()).toEqual(initialUserRolesCount);
      expect(initialUsrAggSupportsCount).toEqual(
        (await UserAggregates.findOne({
          userID: defaultUserID,
        }).exec())!.supports!
      );
      expect(initialGrpAggSportSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportObjectID}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggClubSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLockerRoomSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.supporters!
      );
    }, 30000);
  });
  describe('18. Test Support of LockerRoom (Supporter)', () => {
    let initialGrpAggSportSupportersCount = 0;
    let initialGrpAggLeagueSupportersCount = 0;
    let initialGrpAggClubSupportersCount = 0;
    let initialGrpAggLockerRoomSupportersCount = 0;
    let initialUsrAggSupportsCount = 0;
    let initialUserRolesCount = 0;
    let initialUserRoleIDs: string[];
    let defaultUserUID: string;
    let defaultUserID: string;
    it('1. Initialize', async () => {
      const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress2, password);
      authToken2 = await user.getIdToken(true);
      initialUserRolesCount = await UserRole.countDocuments();
      initialUserRoleIDs = (await UserRole.find().exec()).map((item: any) => item.id);
      defaultUserUID = (await User.findOne({
        emailAddress: emailAddress2,
      }).exec())!.uid!;
      defaultUserID = (await User.findOne({
        emailAddress: emailAddress2,
      }).exec())!.id!;
      initialUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec())!.supporters!;
      initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.supporters!;
      initialGrpAggClubSupportersCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.supporters!;
      initialGrpAggLockerRoomSupportersCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.supporters!;
    }, 30000);
    it('2. Locker Room should exist', async () => {
      const getLockerRoom = await LockerRoom.findById(lockerRoom).exec();
      expect(getLockerRoom).not.toBeNull();
    }, 30000);
    it('3. Check if record exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
      }).exec();
      expect(defaultUser).not.toBeNull();
    }, 30000);
    it('4. Support Locker Room', async () => {
      const {result} = await api.support(
        {
          lockerRoomID: lockerRoom,
        },
        {Authorization: `Bearer ${authToken2}`}
      );
      expect(result.objectType).toEqual('Support');
      expect(result.success).toBeTruthy();
      expect(initialUserRoleIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('5. Supporter should exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
        groupID: club,
      }).exec();
      expect(defaultUser).not.toBeNull();
    }, 30000);
    it('6. UserAggregates should not be updated to add the User on the Locker Room supporters', async () => {
      const finalUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      expect(finalUsrAggSupportsCount).toEqual(initialUsrAggSupportsCount);
    }, 30000);
    it('7. GroupAggregates (Sports) should not increment to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggSportSupportersCount);
    }, 30000);
    it('8. GroupAggregates (League) should not increment to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLeagueSupportersCount);
    }, 30000);
    it('9. GroupAggregates (Club) should not increment to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggClubSupportersCount);
    }, 30000);
    it('10. GroupAggregates (Club Locker Room) should not increment to add the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLockerRoomSupportersCount);
    }, 30000);
    it('11. Record on the ReadMessage Document should exist for the User', async () => {
      const readMessageUser = await ReadMessage.findOne({
        userID: defaultUserID,
      }).exec();
      expect(readMessageUser).not.toBeNull();
    }, 30000);
    it('12. Teardown', async () => {
      expect(await UserRole.countDocuments()).toEqual(initialUserRolesCount);
      expect(initialUsrAggSupportsCount).toEqual(
        (await UserAggregates.findOne({
          userID: defaultUserID,
        }).exec())!.supports!
      );
      expect(initialGrpAggSportSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportObjectID}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggClubSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLockerRoomSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.supporters!
      );
    }, 30000);
  });
  describe('19. Test Un-Support of LockerRoom (Supporter)', () => {
    let initialGrpAggSportSupportersCount = 0;
    let initialGrpAggLeagueSupportersCount = 0;
    let initialGrpAggClubSupportersCount = 0;
    let initialGrpAggLockerRoomSupportersCount = 0;
    let initialUsrAggSupportsCount = 0;
    let initialUserRolesCount = 0;
    let initialUserRoleIDs: string[];
    let defaultUserUID: string;
    let defaultUserID: string;
    it('1. Initialize', async () => {
      initialUserRolesCount = await UserRole.countDocuments();
      initialUserRoleIDs = (await UserRole.find().exec()).map((item: any) => item.id);
      defaultUserUID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.uid!;
      defaultUserID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
      initialUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      initialGrpAggSportSupportersCount = (await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec())!.supporters!;
      initialGrpAggLeagueSupportersCount = (await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec())!.supporters!;
      initialGrpAggClubSupportersCount = (await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec())!.supporters!;
      initialGrpAggLockerRoomSupportersCount = (await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec())!.supporters!;

      const {result} = await api.support(
        {
          lockerRoomID: lockerRoom,
        },
        {Authorization: `Bearer ${authToken}`}
      );

      expect(result.objectType).toEqual('Support');
      expect(result.success).toBeTruthy();
      expect(initialUserRoleIDs.includes(result.objectID!)).toBeFalsy();
      expect(result.timestamp).not.toBeNull();
      expect(initialGrpAggSportSupportersCount + 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportObjectID}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueSupportersCount + 1).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggClubSupportersCount + 1).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLockerRoomSupportersCount + 1).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.supporters!
      );
    }, 30000);
    it('2. Locker Room should exist', async () => {
      const getLockerRoom = await LockerRoom.findById(lockerRoom).exec();
      expect(getLockerRoom).not.toBeNull();
    }, 30000);
    it('3. Check if record exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
      }).exec();
      expect(defaultUser).not.toBeNull();
    }, 30000);
    it('4. UnSupport Locker Room', async () => {
      const result = await api.unsupport(
        {
          lockerRoomID: lockerRoom,
        },
        {Authorization: `Bearer ${authToken}`}
      );

      expect(result).not.toBeNull();
    }, 30000);
    it('5. Supporter should not exist in UserRole Document', async () => {
      const defaultUser = await UserRole.findOne({
        uid: defaultUserUID,
        userID: defaultUserID,
        groupID: club,
      }).exec();
      expect(defaultUser).toBeNull();
    }, 30000);
    it('6. UserAggregates should be updated to remove the User on the Locker Room supporters', async () => {
      const finalUsrAggSupportsCount = (await UserAggregates.findOne({
        userID: defaultUserID,
      }).exec())!.supports!;
      expect(finalUsrAggSupportsCount).toEqual(initialUsrAggSupportsCount);
    }, 30000);
    it('7. GroupAggregates (Sports) should decrement by 1 to remove the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Sport:${sportObjectID}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggSportSupportersCount);
    }, 30000);
    it('8. GroupAggregates (League) should decrement by 1 to remove the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `League:${league}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLeagueSupportersCount);
    }, 30000);
    it('9. GroupAggregates (Club) should decrement by 1 to remove the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `Club:${club}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggClubSupportersCount);
    }, 30000);
    it('10. GroupAggregates (Club Locker Room) should decrement by 1 to remove the User on the supporters', async () => {
      const findGroupAggregates = await GroupAggregates.findOne({
        group: `LockerRoom:${lockerRoom}`,
      }).exec();
      expect(findGroupAggregates?.supporters).toEqual(initialGrpAggLockerRoomSupportersCount);
    }, 30000);
    it('11. Record on the ReadMessage Document should still exist', async () => {
      const readMessageUser = await ReadMessage.findOne({
        userID: defaultUserID,
      }).exec();
      expect(readMessageUser).not.toBeNull();
    }, 30000);
    it('12. Teardown', async () => {
      await ReadMessage.deleteMany({userID: defaultUserID}).exec();
      expect(await UserRole.countDocuments()).toEqual(initialUserRolesCount);
      expect(initialUsrAggSupportsCount).toEqual(
        (await UserAggregates.findOne({
          userID: defaultUserID,
        }).exec())!.supports!
      );
      expect(initialGrpAggSportSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Sport:${sportObjectID}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLeagueSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `League:${league}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggClubSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `Club:${club}`,
        }).exec())!.supporters!
      );
      expect(initialGrpAggLockerRoomSupportersCount).toEqual(
        (await GroupAggregates.findOne({
          group: `LockerRoom:${lockerRoom}`,
        }).exec())!.supporters!
      );
    }, 30000);
  });
};
