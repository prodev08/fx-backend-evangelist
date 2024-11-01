import '../initializers';
import {Notification} from 'lib-mongoose';

async function main() {
  await Notification.updateMany({}, {$set: {isSeen: false}}).exec();
  console.log('Done!');
}

main();
