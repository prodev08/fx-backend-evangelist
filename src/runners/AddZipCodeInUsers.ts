import '../initializers';
import {User} from 'lib-mongoose';

async function main() {
  await User.updateMany({zipCode: {$exists: false}}, {$set: {zipCode: null}}).exec();
  console.log('Done!');
}

main();
