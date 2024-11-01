import '../initializers';
import {Sport} from 'lib-mongoose';

async function main() {
  await Sport.updateMany({Icon: {$exists: false}}, {$set: {Icon: null}}).exec();
  console.log('Done!');
}

main();
