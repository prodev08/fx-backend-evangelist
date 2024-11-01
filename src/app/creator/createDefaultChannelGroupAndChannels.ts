import createChannelGroup from './createChannelGroup';
import createChannel from './createChannel';

export default async function (lockerRoomID: string, group: string) {
  // Create default channel group
  let channelGroupResult;
  if (group.startsWith('Game')) {
    const channelGroupData = {
      name: 'Default',
      description: 'Default channel group for this game.',
      lockerRoomID,
    };
    channelGroupResult = await createChannelGroup(channelGroupData, group);
  } else {
    const channelGroupData = {
      name: 'Information',
      description: 'Default channel group for locker room.',
      lockerRoomID,
    };
    channelGroupResult = await createChannelGroup(channelGroupData, group);
  }
  // Create default channels
  const channelGeneralData = {
    name: 'General',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelAnnouncementsData = {
    name: 'Announcements',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelInjuriesData = {
    name: 'Injuries',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelInquiriesData = {
    name: 'Inquiries',
    description: 'Default channel.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };
  const channelPublicData = {
    name: 'Public',
    description: 'Public channel for this game.',
    channelGroupID: channelGroupResult.id!,
    type: 'Public',
  };

  switch (true) {
    case group.startsWith('Club') || group.startsWith('League'): {
      await createChannel(channelGeneralData!, lockerRoomID!);
      await createChannel(channelAnnouncementsData!, lockerRoomID!);
      await createChannel(channelInjuriesData!, lockerRoomID!);
      break;
    }
    case group.startsWith('FanGroup'): {
      await createChannel(channelGeneralData!, lockerRoomID!);
      break;
    }
    case group.startsWith('InHouse'): {
      await createChannel(channelGeneralData!, lockerRoomID!);
      await createChannel(channelAnnouncementsData!, lockerRoomID!);
      await createChannel(channelInquiriesData!, lockerRoomID!);
      break;
    }
    case group.startsWith('Game'): {
      await createChannel(channelPublicData!, lockerRoomID!);
      break;
    }
    default: {
      break;
    }
  }
}
