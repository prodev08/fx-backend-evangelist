import {Notification, NotificationDocument} from 'lib-mongoose';

export default async function (chatID: string, actorUserID: string) {
  return (await Notification.find({chatID, actorUserID}).exec()).map((item: NotificationDocument) => item.targetUserID);
}
