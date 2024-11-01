import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputViewPage {
  platform: string;
  webDisplaySize?: string | null;
  pageName: string;
  sport?: string | null;
  lockerRoomType?: string | null;
  league?: string | null;
  name?: string | null;
  channel?: string | null;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  ip?: string | null;
  os?: string | null;
}

export default async function (data: inputViewPage, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    platform,
    webDisplaySize,
    pageName,
    sport: Sport,
    lockerRoomType,
    league: League,
    name: Name,
    channel: Channel,
    model: Model,
    browser: Browser,
    browserVersion,
    ip,
    os,
  } = data;
  await track('View Page/Screen', context, {
    Platform: platform,
    'Web Display Size': webDisplaySize,
    'Page Name': pageName,
    Sport,
    'Locker Room Type': lockerRoomType,
    League,
    Name,
    Channel,
    Model,
    Browser,
    'Browser Version': browserVersion,
    ip: ip || ipAddress,
    $os: os,
  });
}
