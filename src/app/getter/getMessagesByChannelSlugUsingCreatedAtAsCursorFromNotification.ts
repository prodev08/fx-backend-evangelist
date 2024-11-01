import {Message} from 'lib-mongoose';

export default async function (channelSlug: string, count: number, cursor: number) {
  let items;
  const additionalItem = await Message.find({$and: [{channelSlug}, {createdAt: {$lt: cursor}}]})
    .sort({createdAt: -1})
    .limit(1)
    .exec();
  count = additionalItem.length > 0 ? count - 1 : count;
  items = await Message.find({$and: [{channelSlug}, {createdAt: {$gte: cursor}}]})
    .sort({createdAt: 1})
    .limit(count)
    .exec();
  items = additionalItem.concat(items);
  return items;
}
