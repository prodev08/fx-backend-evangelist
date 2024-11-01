import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import trackLogin from '../../../app/mixpanel/event/trackLogin';
import trackRegisterAccount from '../../../app/mixpanel/event/trackRegisterAccount';
import trackSendMessage from '../../../app/mixpanel/event/trackSendMessage';
import trackViewPage from '../../../app/mixpanel/event/trackViewPage';
import setProfile from '../../../app/mixpanel/user/setProfile';
import setMessagesSent from '../../../app/mixpanel/user/setMessagesSent';
import setLockerRoomsSupported from '../../../app/mixpanel/user/setLockerRoomsSupported';
import trackSupportLockerRoom from '../../../app/mixpanel/event/trackSupportLockerRoom';

export const MixpanelMutations = mutationField(t => {
  t.nonNull.field('trackLogin', {
    type: 'MutationResult',
    args: {
      loginMethod: nonNull(stringArg()),
      ip: stringArg(),
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {loginMethod, ip, platform, webDisplaySize, pageName, model, browser, browserVersion, os},
      context
    ) => {
      await trackLogin(
        {loginMethod, ip, platform, webDisplaySize, pageName, model, browser, browserVersion, os},
        context
      );
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  t.nonNull.field('trackRegisterAccount', {
    type: 'MutationResult',
    args: {
      username: nonNull(stringArg()),
      emailAddress: nonNull(stringArg()),
      avatar: nonNull(stringArg()),
      registrationMethod: nonNull(stringArg()),
      avatarObjectID: stringArg(),
      ip: stringArg(),
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {
        username,
        emailAddress,
        avatar,
        registrationMethod,
        avatarObjectID,
        ip,
        platform,
        webDisplaySize,
        pageName,
        model,
        browser,
        browserVersion,
        os,
      },
      context
    ) => {
      await setProfile({username, emailAddress, ip, avatarObjectID}, context).then(async () => {
        await trackRegisterAccount(
          {
            username,
            emailAddress,
            avatar,
            registrationMethod,
            ip,
            platform,
            webDisplaySize,
            pageName,
            model,
            browser,
            browserVersion,
            os,
          },
          context
        );
      });
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  t.nonNull.field('trackSendMessage', {
    type: 'MutationResult',
    args: {
      sport: nonNull(stringArg()),
      lockerRoomType: nonNull(stringArg()),
      league: stringArg(),
      name: nonNull(stringArg()),
      channel: nonNull(stringArg()),
      type: nonNull(stringArg()),
      ip: stringArg(),
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {
        sport,
        lockerRoomType,
        league,
        name,
        channel,
        type,
        ip,
        platform,
        webDisplaySize,
        pageName,
        model,
        browser,
        browserVersion,
        os,
      },
      context
    ) => {
      await trackSendMessage(
        {
          sport,
          lockerRoomType,
          league,
          name,
          channel,
          type,
          ip,
          platform,
          webDisplaySize,
          pageName,
          model,
          browser,
          browserVersion,
          os,
        },
        context
      );
      await setMessagesSent(context, 1);
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  t.nonNull.field('trackSupportLockerRoom', {
    type: 'MutationResult',
    args: {
      sport: nonNull(stringArg()),
      lockerRoomType: nonNull(stringArg()),
      league: stringArg(),
      name: nonNull(stringArg()),
      ip: stringArg(),
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {sport, lockerRoomType, league, name, ip, platform, webDisplaySize, pageName, model, browser, browserVersion, os},
      context
    ) => {
      await trackSupportLockerRoom(
        'Support Locker Room',
        {
          sport,
          lockerRoomType,
          league,
          name,
          ip,
          platform,
          webDisplaySize,
          pageName,
          model,
          browser,
          browserVersion,
          os,
        },
        context
      );
      await setLockerRoomsSupported(context, 1);
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  t.nonNull.field('trackUnsupportLockerRoom', {
    type: 'MutationResult',
    args: {
      sport: nonNull(stringArg()),
      lockerRoomType: nonNull(stringArg()),
      league: stringArg(),
      name: nonNull(stringArg()),
      ip: stringArg(),
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {sport, lockerRoomType, league, name, ip, platform, webDisplaySize, pageName, model, browser, browserVersion, os},
      context
    ) => {
      await trackSupportLockerRoom(
        'Unsupport Locker Room',
        {
          sport,
          lockerRoomType,
          league,
          name,
          ip,
          platform,
          webDisplaySize,
          pageName,
          model,
          browser,
          browserVersion,
          os,
        },
        context
      );
      await setLockerRoomsSupported(context, -1);
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  t.nonNull.field('trackViewPage', {
    type: 'MutationResult',
    args: {
      platform: nonNull(stringArg()),
      webDisplaySize: stringArg(),
      pageName: nonNull(stringArg()),
      sport: stringArg(),
      lockerRoomType: stringArg(),
      league: stringArg(),
      name: stringArg(),
      channel: stringArg(),
      model: stringArg(),
      browser: stringArg(),
      browserVersion: stringArg(),
      ip: stringArg(),
      os: stringArg(),
    },
    resolve: async (
      source,
      {
        platform,
        webDisplaySize,
        pageName,
        sport,
        lockerRoomType,
        league,
        name,
        channel,
        model,
        browser,
        browserVersion,
        ip,
        os,
      },
      context
    ) => {
      await trackViewPage(
        {
          platform,
          webDisplaySize,
          pageName,
          sport,
          lockerRoomType,
          league,
          name,
          channel,
          model,
          browser,
          browserVersion,
          ip,
          os,
        },
        context
      );
      return new MutationResult('Mixpanel', context.uid);
    },
  });
  // t.nonNull.field('setProfile', {
  //   type: 'MutationResult',
  //   args: {
  //     username: nonNull(stringArg()),
  //     emailAddress: nonNull(stringArg()),
  //     ip: stringArg(),
  //   },
  //   resolve: async (source, {username, emailAddress, ip}, context) => {
  //     await setProfile({username, emailAddress, ip}, context);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
  // t.nonNull.field('incrementClubsSupported', {
  //   type: 'MutationResult',
  //   resolve: async (source, args, context) => {
  //     await setClubsSupported(context, 1);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
  // t.nonNull.field('decrementClubsSupported', {
  //   type: 'MutationResult',
  //   resolve: async (source, args, context) => {
  //     await setClubsSupported(context, -1);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
  // t.nonNull.field('incrementLeaguesSupported', {
  //   type: 'MutationResult',
  //   resolve: async (source, args, context) => {
  //     await setLeaguesSupported(context, 1);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
  // t.nonNull.field('decrementLeaguesSupported', {
  //   type: 'MutationResult',
  //   resolve: async (source, args, context) => {
  //     await setLeaguesSupported(context, -1);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
  // t.nonNull.field('incrementMessagesSent', {
  //   type: 'MutationResult',
  //   resolve: async (source, args, context) => {
  //     await setMessagesSent(context, 1);
  //     return new MutationResult('Mixpanel', context.uid);
  //   },
  // });
});
