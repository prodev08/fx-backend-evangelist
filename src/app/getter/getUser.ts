import {User} from 'lib-mongoose';

export default async function (uid: string | null | undefined) {
  return await User.findOne({
    uid: uid,
  }).exec();
}
