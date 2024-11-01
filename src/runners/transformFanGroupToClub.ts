import '../initializers';
import {ChannelGroup, Club, FanGroup, GroupAggregates, LockerRoom, UserInvites, UserRole} from 'lib-mongoose';
import stringToSlug from '../app/transform/stringToSlug';
import sportIDShouldMatchLeagueSportID from '../app/checker/sportIDShouldMatchLeagueSportID';

async function main(id: string, leagueID: string) {
  const fanGroup = await FanGroup.findById(id).exec();
  if (fanGroup) {
    await sportIDShouldMatchLeagueSportID(fanGroup.sportIDs, leagueID);
    const {name, sportIDs, Avatar, CoverPhoto, createdAt, updatedAt, isFeatured} = fanGroup;
    const slug = await stringToSlug(Club, name, false, true, false);
    // create club
    const result = await Club.create({
      name,
      slug,
      sportIDs,
      Avatar,
      CoverPhoto,
      leagueID,
      createdAt,
      updatedAt,
      isFeatured,
    });
    // replace groupAggregates group and transfer count from fanGroups to clubs
    const group = `Club:${result.id}`;
    const fanGroupGroup = `FanGroup:${id}`;
    console.log(`Created ${group}`);
    const {channelGroups, channels} = (await GroupAggregates.findOneAndUpdate({group: fanGroupGroup}, {group}).exec())!;
    await GroupAggregates.increment(`Sport:${sportIDs[0]}`, {
      clubs: 1,
    });
    await GroupAggregates.increment(`Sport:${sportIDs[0]}`, {
      fanGroups: -1,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      clubs: 1,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      channelGroups: channelGroups!,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      channels: channels!,
    });
    console.log('Done updating GroupAggregates');
    // replace lockerRoom group
    const lockerRoomID = (await LockerRoom.findOneAndUpdate({group: fanGroupGroup}, {group}).exec())!.id;
    console.log('Done updating Locker Room');
    // replace ChannelGroup group
    await ChannelGroup.updateMany({lockerRoomID}, {group});
    console.log('Done updating Channel Group');
    // replace group, groupType, groupID of UserRole
    await UserRole.updateMany({lockerRoomID}, {group, groupType: 'Club', groupID: result.id});
    console.log('Done updating User Role');
    // replace data.group, group in UserInvites
    await UserInvites.updateMany({group: fanGroupGroup}, {'data.group': group, group});
    console.log('Done updating User Invites');
    // delete fanGroup
    await FanGroup.findByIdAndDelete(id).exec();
    console.log(`Done removing ${name} FanGroup`);
  }
}
main('630c4bde39e097c5448416b0', '630c4bc239e097c544841679').then();
