import {IDataLoaders} from './IDataLoaders';

export interface IAppResolverContext {
  uid?: string | null | undefined;
  email?: string | null | undefined;
  userID?: string | null | undefined;
  ip?: string | null | undefined;
  // platform?: string | null | undefined;
  // webDisplaySize?: string | null | undefined;
  // pageName?: string | null | undefined;
  loaders?: IDataLoaders;
}
