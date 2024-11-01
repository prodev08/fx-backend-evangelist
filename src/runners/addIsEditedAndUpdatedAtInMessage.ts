import '../initializers';
import {Message} from 'lib-mongoose';

async function main() {
  await Message.updateMany({}, {$set: {isEdited: false}}).exec();
  const messages = await Message.find({}).exec();
  for (const message of messages) {
    await Message.updateOne({chatID: message.chatID}, {$set: {updatedAt: message.createdAt}}).exec();
  }
  console.log('Done!');
}

main();
