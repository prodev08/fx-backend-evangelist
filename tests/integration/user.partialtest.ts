// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
//import globalSetup from '../utilities/globalSetup';
import {User, ProfileAction} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
const emailAddress = 'automatedtester1@fx1.io';
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
});

export default () => {
  describe('26. Test Block User', () => {
    let initialProfileActionCount = 0;
    let defaultActorID: string;
    let defaultTargetID: string;
    it('1. Initialize', async () => {
      initialProfileActionCount = await ProfileAction.countDocuments();
      defaultActorID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
      defaultTargetID = (await User.findOne({
        emailAddress: emailAddress2,
      }).exec())!.id!;
    }, 30000);
    it('2. Reporter (actorUserID) should exist', async () => {
      const getActor = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.uid!;
      expect(getActor).not.toBeNull();
    }, 30000);
    it('3. Reported User (targetUserID) should exist', async () => {
      const getTarget = (await User.findOne({
        emailAddress: emailAddress2,
      }).exec())!.uid!;
      expect(getTarget).not.toBeNull();
    }, 30000);
    it('4. Block User', async () => {
      const {result} = await api.blockUser(
        {
          targetUserID: defaultTargetID,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result.objectType).toEqual('User');
      expect(result.success).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('5. Profile Action record should be created', async () => {
      const getProfileAction = await ProfileAction.findOne({
        actorUserID: defaultActorID,
        targetUserID: defaultTargetID,
        action: 'Block',
      }).exec();
      expect(getProfileAction).not.toBeNull();
    }, 30000);
    it('6. Teardown', async () => {
      await ProfileAction.deleteMany({actorUserID: defaultActorID}).exec();
      expect(await ProfileAction.countDocuments()).toEqual(initialProfileActionCount);
    }, 30000);
  });
};
