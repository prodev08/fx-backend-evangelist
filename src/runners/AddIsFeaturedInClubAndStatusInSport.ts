import '../initializers';
import {Sport, Club} from 'lib-mongoose';

async function main() {
  await Sport.updateMany({slug: {$ne: 'basketball'}}, {$set: {status: 'Coming Soon'}}).exec();
  await Sport.updateMany({slug: 'basketball'}, {$set: {status: 'Available'}}).exec();
  await Club.updateMany({}, {$set: {isFeatured: false}}).exec();
  console.log('Done!');
}

main();
