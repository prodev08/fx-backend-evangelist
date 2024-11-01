// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
//import globalSetup from '../utilities/globalSetup';
import {User, FormEntry, Message, Logs} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
const emailAddress = 'automatedtester1@fx1.io';
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
  describe('27. Test Report User Message', () => {
    let initialFormEntryCount = 0;
    let initialLogsCount = 0;
    let message: string;
    let messageID: string;
    let violatorUserID: string;
    let reporterUserID: string;
    let reason: string;
    let data: any;
    let newFormEntryObjectID: string;

    it('1. Initialize', async () => {
      initialFormEntryCount = await FormEntry.countDocuments();
      initialLogsCount = await Logs.countDocuments();
      messageID = (await Message.find().exec())[0].id;
      message = (await Message.findById(messageID).exec())!.text!;
      violatorUserID = (await Message.findById(messageID).exec())!.userID!;
      reporterUserID = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.id!;
      reason = 'Test Report User Message';
      data = {
        message: message,
        messageID: messageID,
        reporterUserID: reporterUserID,
        violatorUserID: violatorUserID,
        reason: reason,
      };
    }, 30000);
    it('2. Reporter should exist', async () => {
      const getActor = (await User.findOne({
        emailAddress: emailAddress,
      }).exec())!.uid!;
      expect(getActor).not.toBeNull();
    }, 30000);
    it('3. Reported User (violator) should exist', async () => {
      const getTarget = await User.findById(violatorUserID).exec();
      expect(getTarget).not.toBeNull();
    }, 30000);
    it('4. Report User Message', async () => {
      const {result} = await api.createFormEntry(
        {
          type: 'ReportMessage',
          data: data,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      newFormEntryObjectID = result.objectID!;
      expect(result.objectType).toEqual('FormEntry');
      expect(result.success).toBeTruthy();
      expect(result.timestamp).not.toBeNull();
    }, 30000);
    it('5. Form Entry record should be created', async () => {
      const getFormEntry = await FormEntry.findById(newFormEntryObjectID).exec();
      expect(getFormEntry).not.toBeNull();
    }, 30000);
    it('6. Logs record should be created', async () => {
      const getLogs = await Logs.findOne({type: 'createFormEntry-ReportMessage'}).exec();
      expect(getLogs).not.toBeNull();
    }, 30000);
    it('7. Teardown', async () => {
      await FormEntry.findByIdAndDelete(newFormEntryObjectID).exec();
      await Logs.deleteMany({type: 'createFormEntry-ReportMessage'}).exec();
      expect(await FormEntry.countDocuments()).toEqual(initialFormEntryCount);
      expect(await Logs.countDocuments()).toEqual(initialLogsCount);
    }, 30000);
  });
};
