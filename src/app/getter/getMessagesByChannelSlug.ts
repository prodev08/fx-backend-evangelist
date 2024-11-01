import {Message} from 'lib-mongoose';

export default async function (channelSlug: string, count: number, cursor: number) {
  return (await Message.find({channelSlug}).sort({createdAt: -1}).skip(cursor).limit(count).exec()).reverse();
}
