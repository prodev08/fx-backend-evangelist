import '../initializers';
import {Game} from 'lib-mongoose';

async function main() {
  await Game.updateMany({isFeatured: {$exists: false}}, {$set: {isFeatured: false}}).exec();
  console.log('Done!');
}

main();
