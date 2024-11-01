import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputRegisterAccount {
  username: string;
  emailAddress: string;
  avatar: string;
  registrationMethod: string;
  ip?: string | null;
  platform: string;
  webDisplaySize?: string | null;
  pageName: string;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
}

export default async function (data: inputRegisterAccount, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    username: Username,
    emailAddress,
    avatar: Avatar,
    registrationMethod: RegistrationMethod,
    ip,
    platform,
    webDisplaySize,
    pageName,
    model: Model,
    browser: Browser,
    browserVersion,
    os,
  } = data;
  await track('Register Account', context, {
    Username,
    $email: emailAddress,
    Avatar,
    'Registration Method': RegistrationMethod,
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
