import {UserRole, UserRoleDocument} from 'lib-mongoose';

export default async function (lockerRoomID: string) {
  const result = await UserRole.find({
    $and: [
      {lockerRoomID},
      {
        $or: [{groupType: 'Club'}, {groupType: 'League'}, {groupType: 'FanGroup'}, {groupType: 'InHouse'}],
      },
    ],
  }).exec();
  return {
    Owners: await getRolesByLockerRoomID(lockerRoomID, result, 'owner'),
    Managers: await getRolesByLockerRoomID(lockerRoomID, result, 'manager'),
    Supporters: await getRolesByLockerRoomID(lockerRoomID, result, 'supporter'),
  };
}

export async function getRolesByPrivateChannelID(privateChannelID: string) {
  const result = await UserRole.find({
    groupID: privateChannelID,
    groupType: 'Channel',
  }).exec();
  return {
    Owners: await getRolesByLockerRoomID(privateChannelID, result, 'owner'),
    Joiners: await getRolesByLockerRoomID(privateChannelID, result, 'joiner'),
  };
}

async function getRolesByLockerRoomID(lockerRoomID: string, result: UserRoleDocument[], type: string) {
  return result.filter(item => item.role.toLowerCase() === type);
}
