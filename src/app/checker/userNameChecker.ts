import {User} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (username: string) {
  username = username.toLowerCase();
  const regex = /^[0-9a-zA-Z\\_]{3,18}$/g;
  const testRegex = regex.test(username);
  if (!testRegex) {
    // throw new UserInputError(`Username is invalid. It should only contains letters, numbers or underscore with a minimum of 3 characters and maximum of 18. Input: ${username}`);
    throw new UserInputError(
      `Username should only contain letters, numbers or an underscore with a min of 3 characters and max of 18. Input: ${username}`
    );
  }
  const exists = await User.findOne({username}).exec();
  if (exists) {
    throw new UserInputError(`Username exists. Input: ${username}`);
  }
}
