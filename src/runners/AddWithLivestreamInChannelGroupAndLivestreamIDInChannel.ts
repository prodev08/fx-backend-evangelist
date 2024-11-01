import '../initializers';
import {ChannelGroup, Channel} from 'lib-mongoose';

async function main() {
  await ChannelGroup.updateMany({}, {$set: {withLivestream: false}}).exec();
  await Channel.updateMany({}, {$set: {livestreamID: null}}).exec();
  console.log('Done!');
}

main();
