import '../initializers';
import {FanGroup, GroupAggregates, LockerRoom, UserAggregates, UserRole} from 'lib-mongoose';
import stringToObjectId from '../app/transform/stringToObjectId';

async function main(fanGroupID: string) {
  const sportID = (await FanGroup.findById(fanGroupID).exec())?.sportIDs[0];
  console.log('sportID', sportID);
  const lockerRoomID = (await LockerRoom.findOne({group: `FanGroup:${fanGroupID}`}).exec())?.id;
  console.log('lockerRoomID', lockerRoomID);
  const _id = await stringToObjectId(fanGroupID);
  console.log('_id', _id);
  const supporters = await UserRole.find({groupID: fanGroupID}).exec();
  const supporterCount = supporters.length;
  console.log('supporterCount', supporterCount);

  // Update isDeleted of FanGroup
  await FanGroup.updateOne({_id}, {isDeleted: true});
  // Update GroupAggregates
  await GroupAggregates.increment(`Sport:${sportID}`, {supporters: -supporterCount});
  await GroupAggregates.increment(`FanGroup:${fanGroupID}`, {supporters: -supporterCount});
  await GroupAggregates.increment(`LockerRoom:${lockerRoomID}`, {supporters: -supporterCount});
  // Delete UserRole
  await UserRole.deleteMany({groupID: fanGroupID});
  // Update UserAggregates
  for (const supporter of supporters) {
    const userID = supporter.userID;
    console.log('userID', userID);
    await UserAggregates.increment(userID, {supports: -1});
  }
}

main('630d7d09f8a1cd36a190a167');
