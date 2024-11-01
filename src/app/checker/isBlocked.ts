import {ProfileAction} from 'lib-mongoose';

export default async function (actorUserID?: string | null, targetUserID?: string | null) {
  const blocked = await ProfileAction.findOne({action: 'Block', actorUserID, targetUserID}).exec();
  return blocked !== null;
}
