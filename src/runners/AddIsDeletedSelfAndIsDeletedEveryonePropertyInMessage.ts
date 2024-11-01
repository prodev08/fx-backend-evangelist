import '../initializers';
import {Message} from 'lib-mongoose';

async function main() {
  await Message.updateMany({}, {$set: {isDeletedSelf: false}}).exec();
  await Message.updateMany({}, {$set: {isDeletedEveryone: false}}).exec();
  console.log('Done!');
}

main();
