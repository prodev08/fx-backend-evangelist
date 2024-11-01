import slugify from '@sindresorhus/slugify';
import {Model} from 'mongoose';
import * as _ from 'lodash';

type Slugged = {
  username: string;
  _id: string;
};

export default async function (model: typeof Model, string: string) {
  const baseUsername = slugify(string);
  const username = (await model.find({username: baseUsername}, 'username').exec()).map((x: Slugged) => x.username);

  const exists = username.includes(baseUsername);

  if (!exists) {
    return baseUsername;
  }
  const skip = baseUsername.length;
  const maxSlug =
    (_.chain(username)
      .map((x: string) => parseInt(x.substring(skip).replace('-', '')))
      .filter((x: any) => !isNaN(x))
      .compact()
      .max()
      .value() || 0) + 1;
  return `${baseUsername}${maxSlug}`;
}
