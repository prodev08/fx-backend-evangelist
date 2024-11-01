// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {Channel, Message, ReadMessage, User, UserRole} from 'lib-mongoose';
import {FirebaseApp, initializeApp} from 'firebase/app';
import firebaseConfig from '../../src/firebase.json';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const url = 'http://localhost:8080/graphql';
let firebaseApp: FirebaseApp;
let authToken: String;
let api: ReturnType<typeof getSdk>;
const emailAddress = 'automatedtester1@fx1.io';
const password = 'p588w012D';

let lockerRoomID: string;
let channelSlug: string;
let userId: string;
let uid: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  // @ts-ignore
  firebaseApp = initializeApp(firebaseConfig[global.appEnv]);
  const {user} = await signInWithEmailAndPassword(getAuth(firebaseApp), emailAddress, password);
  authToken = await user.getIdToken(true);
  const client = new GraphQLClient(url);
  api = getSdk(client);
  // get uid of user
  const user1 = await User.findOne({emailAddress}).exec();
  userId = user1!.id;
  uid = user1!.uid;
  // get id of locker room it supports
  const userRole = await UserRole.findOne({uid}).exec();
  lockerRoomID = userRole!.lockerRoomID;
  // get 1 channel slug under that locker room
  const channel = await Channel.findOne({lockerRoomID}).exec();
  channelSlug = channel!.slug;
});

export default () => {
  let MessageCount: number;
  let ReadMessageCount: number;
  let messageID: string;
  describe('20. SendMessage - Text Only', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: 'Hello World!',
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: null,
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Sent message should be queryable', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it("4. Text shouldn't be null", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.text).not.toBeNull();
    }, 30000);
    it('5. Media should be null', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.Media).toBeNull();
    }, 30000);
    it("6. UserID of the message should be equal to the logged in user's id", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.userID).not.toBeNull();
      expect(message!.userID).toEqual(userId);
    }, 30000);
    it('7. ReadMessage document should be created', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('8. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
  describe('21. SendMessage - Image Only', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: null,
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: [
            {
              objectID: '12a8d819-0305-4441-a821-6b973d8fc467',
              objectType: 'Photo',
            },
          ],
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Sent message should be queryable', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it('4. Text should be null', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.text).toBeNull();
    }, 30000);
    it("5. Media shouldn't be null", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.Media).not.toBeNull();
      expect(message!.Media!.length).toEqual(1);
    }, 30000);
    it("6. UserID of the message should be equal to the logged in user's id", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.userID).not.toBeNull();
      expect(message!.userID).toEqual(userId);
    }, 30000);
    it('7. ReadMessage document should be created', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('8. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
  describe('22. SendMessage - Text with Image', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: 'Hello World!',
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: [
            {
              objectID: '12a8d819-0305-4441-a821-6b973d8fc467',
              objectType: 'Photo',
            },
          ],
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Sent message should be queryable', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it("4. Text shouldn't be null", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.text).not.toBeNull();
    }, 30000);
    it("5. Media shouldn't be null", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.Media).not.toBeNull();
      expect(message!.Media!.length).toEqual(1);
    }, 30000);
    it("6. UserID of the message should be equal to the logged in user's id", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.userID).not.toBeNull();
      expect(message!.userID).toEqual(userId);
    }, 30000);
    it('7. ReadMessage document should be created', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('8. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
  describe('23. EditMessage - Text Only (Non Reply)', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: 'Hello World!',
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: null,
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Edit Message', async () => {
      const editMessage = await api.editMessage(
        {
          text: 'Hello World! - Edit',
          chatID: '000-to-be-deleted-000',
          // repliedToChatID: null,
          // Media: null,
          // MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(editMessage).not.toBeNull();
    }, 30000);
    it('4. Message should be queryable', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it("5. Text shouldn't be null", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.text).not.toBeNull();
      expect(message!.text).toEqual('Hello World! - Edit');
    }, 30000);
    it('6. Media should be null', async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.Media).toBeNull();
    }, 30000);
    it("7. UserID of the message should be equal to the logged in user's id", async () => {
      const message = await Message.findById(messageID).exec();
      expect(message!.userID).not.toBeNull();
      expect(message!.userID).toEqual(userId);
    }, 30000);
    it('8. ReadMessage document should be created', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('9. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
  describe('24. DeleteMessage - For Everyone', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: 'Hello World!',
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: null,
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Delete Message', async () => {
      const deleteMessage = await api.deleteMessage(
        {
          chatID: '000-to-be-deleted-000',
          deleteForSelf: false,
          deleteForEveryone: true,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(deleteMessage).not.toBeNull();
    }, 30000);
    it('4. Message should not be queryable (tagged as Deleted for Everyone)', async () => {
      const message = await Message.findOne({
        chatID: '000-to-be-deleted-000',
        deleteForEveryone: true,
      }).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it('5. ReadMessage document should is not deleted', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('6. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
  describe('25. DeleteMessage - For Self', () => {
    it('1. Check whether the input channelSlug is existing', async () => {
      const {result} = await api.getChannel({
        slug: channelSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Initialize', async () => {
      MessageCount = await Message.countDocuments();
      ReadMessageCount = await ReadMessage.countDocuments();
      const {result} = await api.sendMessage(
        {
          channelSlug: channelSlug,
          text: 'Hello World!',
          chatID: '000-to-be-deleted-000',
          repliedToChatID: null,
          Media: null,
          MentionedUserIDs: null,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(result).not.toBeNull();
      messageID = result.objectID!;
    }, 30000);
    it('3. Delete Message', async () => {
      const deleteMessage = await api.deleteMessage(
        {
          chatID: '000-to-be-deleted-000',
          deleteForSelf: true,
          deleteForEveryone: false,
        },
        {Authorization: `Bearer ${authToken}`}
      );
      expect(deleteMessage).not.toBeNull();
    }, 30000);
    it('4. Message should not be queryable for the Original Sender (tagged as Deleted for Self)', async () => {
      const message = await Message.findOne({
        chatID: '000-to-be-deleted-000',
        deleteForSelf: true,
      }).exec();
      expect(message).not.toBeNull();
    }, 30000);
    it('5. ReadMessage document should is not deleted', async () => {
      const readMessage = await ReadMessage.findOne({messageID, userId, channelSlug}).exec();
      expect(readMessage).not.toBeNull();
    }, 30000);
    it('6. Teardown', async () => {
      await Message.findByIdAndDelete(messageID).exec();
      await ReadMessage.findOneAndDelete({messageID, userId, channelSlug}).exec();
      expect(MessageCount).toEqual(await Message.countDocuments());
      expect(ReadMessageCount).toEqual(await ReadMessage.countDocuments());
    }, 30000);
  });
};
