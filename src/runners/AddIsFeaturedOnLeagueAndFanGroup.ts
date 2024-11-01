import '../initializers';
import {League, FanGroup} from 'lib-mongoose';

async function main() {
  await League.updateMany(
    {$and: [{isFeatured: {$ne: true}}, {isFeatured: {$eq: undefined}}]},
    {$set: {isFeatured: false}}
  ).exec();
  await FanGroup.updateMany(
    {$and: [{isFeatured: {$ne: true}}, {isFeatured: {$eq: undefined}}]},
    {$set: {isFeatured: false}}
  ).exec();
  console.log('Done!');
}

main();
