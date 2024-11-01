import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputSupportLockerRoom {
  sport: string;
  lockerRoomType: string;
  league?: string | null;
  name: string;
  ip?: string | null;
  platform: string;
  webDisplaySize?: string | null;
  pageName: string;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
}

export default async function (event: string, data: inputSupportLockerRoom, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    sport: Sport,
    lockerRoomType,
    league: League,
    name: Name,
    ip,
    platform,
    webDisplaySize,
    pageName,
    model: Model,
    browser: Browser,
    browserVersion,
    os,
  } = data;
  await track(event, context, {
    Sport,
    'Locker Room Type': lockerRoomType,
    League,
    Name,
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
