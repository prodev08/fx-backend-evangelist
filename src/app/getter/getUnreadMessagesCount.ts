import {Message, ReadMessage} from 'lib-mongoose';

export default async function (uid: string, channelSlug: string) {
  const getLastReadMessageID = (await ReadMessage.findOne({uid, channelSlug}).exec())?.messageID;
  let filter;
  if (getLastReadMessageID) {
    const id = (await Message.findById(getLastReadMessageID).exec())?.id;
    filter = {$and: [{channelSlug}, {_id: {$gt: id}}]};
  } else {
    filter = {channelSlug};
  }
  return await Message.countDocuments(filter);
}
