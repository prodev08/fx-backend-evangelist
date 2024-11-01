import track from './track';
import {IAppResolverContext} from '../../../interfaces';

interface inputSendMessage {
  sport: string;
  lockerRoomType: string;
  league?: string | null;
  name: string;
  channel: string;
  type: string;
  ip?: string | null;
  platform: string;
  webDisplaySize?: string | null;
  pageName: string;
  model?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
}

export default async function (data: inputSendMessage, context: IAppResolverContext) {
  const {ip: ipAddress} = context;
  const {
    sport: Sport,
    lockerRoomType,
    league: League,
    name: Name,
    channel: Channel,
    type: Type,
    ip,
    platform,
    webDisplaySize,
    pageName,
    model: Model,
    browser: Browser,
    browserVersion,
    os,
  } = data;
  await track('Send Message', context, {
    Sport,
    'Locker Room Type': lockerRoomType,
    League,
    Name,
    Channel,
    Type,
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
