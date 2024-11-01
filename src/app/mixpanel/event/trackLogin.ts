import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputLogin {
  loginMethod: string;
  ip?: string | null;
  platform: string;
  webDisplaySize?: string | null;
  pageName: string;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
}

export default async function (data: inputLogin, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    loginMethod,
    ip,
    platform,
    webDisplaySize,
    pageName,
    model: Model,
    browser: Browser,
    browserVersion,
    os,
  } = data;
  await track('Login', context, {
    'Login Method': loginMethod,
    ip: ip || ipAddress,
    Platform: platform,
    'Web Display Size': webDisplaySize,
    'Page Name': pageName,
    Model,
    Browser,
    'Browser version': browserVersion,
    $os: os,
  });
}
