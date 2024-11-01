import * as zipCodes from 'zipcodes';
import {UserInputError} from 'apollo-server-express';

export default async function (zipCode: string) {
  const validZipCode = zipCodes.lookup(zipCode);
  if (validZipCode?.country === 'US') {
    return validZipCode;
  }
  throw new UserInputError(`${zipCode} is not a valid US Zip Code.`);
}
