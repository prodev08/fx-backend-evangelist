import '../initializers';
import {GroupAggregates, Sport} from 'lib-mongoose';

async function main() {
  await Sport.updateMany({}, {$set: {isHidden: false}}).exec();
  await Sport.updateMany({slug: 'in-house'}, {$set: {isHidden: true}}).exec();
  await GroupAggregates.updateMany({}, {$set: {inHouses: 0}}).exec();
  console.log('Done!');
}

main();
