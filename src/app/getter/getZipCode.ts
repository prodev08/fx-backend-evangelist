import {ZipCode} from 'lib-mongoose';

export default async function (zip: string) {
  return await ZipCode.findOne({zip}).exec();
}
