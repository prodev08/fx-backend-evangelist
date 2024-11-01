import {IAppResolverContext} from '../../../interfaces';
import {AuthenticationError} from 'apollo-server-express';

export default function (event: string, context: IAppResolverContext, properties?: any) {
  const {uid: distinct_id} = context;
  if (!distinct_id) {
    throw new AuthenticationError('Distinct ID is empty.');
  }
  mixpanel.track(event, {
    distinct_id,
    ...properties,
  });
}
