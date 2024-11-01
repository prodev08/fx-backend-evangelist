import '../initializers';
import {FanGroup} from 'lib-mongoose';

async function main() {
  await FanGroup.updateMany({}, {$set: {isDeleted: false}}).exec();
  console.log('Done!');
}

main();
