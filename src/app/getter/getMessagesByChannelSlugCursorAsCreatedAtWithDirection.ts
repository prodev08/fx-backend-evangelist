import {Message} from 'lib-mongoose';

export default async function (direction: string, channelSlug: string, count: number, cursor: number) {
  let items;
  if (direction === 'up') {
    items = (
      await Message.find({$and: [{channelSlug}, {createdAt: {$lt: cursor}}]})
        .sort({createdAt: -1})
        .limit(count)
        .exec()
    ).reverse();
  } else {
    items = await Message.find({$and: [{channelSlug}, {createdAt: {$gt: cursor}}]})
      .sort({createdAt: 1})
      .limit(count)
      .exec();
  }
  return items;
}
