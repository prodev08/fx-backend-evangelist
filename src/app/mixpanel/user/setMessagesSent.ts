import {IAppResolverContext} from '../../../interfaces';
import {AuthenticationError} from 'apollo-server-express';

export default async function (context: IAppResolverContext, value: number) {
  const {uid: distinct_id} = context;
  if (!distinct_id) {
    throw new AuthenticationError('Distinct ID is empty.');
  }
  await mixpanel.people.increment(distinct_id!, {'Messages Sent': value});
}
