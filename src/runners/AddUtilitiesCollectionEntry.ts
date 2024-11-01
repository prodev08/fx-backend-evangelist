import '../initializers';
import {Utilities} from 'lib-mongoose';

async function main() {
  await Utilities.findOneAndUpdate(
    {key: 'defaultMaxChannelCount'},
    {key: 'defaultMaxChannelCount', value: 150},
    {upsert: true, new: true}
  ).exec();
  console.log('Done!');
}

main();
