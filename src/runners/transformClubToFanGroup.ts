import '../initializers';
import {ChannelGroup, Club, FanGroup, GroupAggregates, LockerRoom, UserInvites, UserRole} from 'lib-mongoose';
import stringToSlug from '../app/transform/stringToSlug';

async function main(id: string) {
  const club = await Club.findById(id).exec();
  if (club) {
    const {name, sportIDs, Avatar, CoverPhoto, leagueID, createdAt, updatedAt, isFeatured} = club;
    const slug = await stringToSlug(FanGroup, name, false, true, false);
    // create fan group
    const result = await FanGroup.create({name, slug, sportIDs, Avatar, CoverPhoto, createdAt, updatedAt, isFeatured});
    // replace groupAggregates group and transfer count from club to fanGroups
    const group = `FanGroup:${result.id}`;
    const clubGroup = `Club:${id}`;
    console.log(`Created ${group}`);
    const {channelGroups, channels} = (await GroupAggregates.findOneAndUpdate({group: clubGroup}, {group}).exec())!;
    await GroupAggregates.increment(`Sport:${sportIDs[0]}`, {
      clubs: -1,
    });
    await GroupAggregates.increment(`Sport:${sportIDs[0]}`, {
      fanGroups: 1,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      clubs: -1,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      channelGroups: -channelGroups!,
    });
    await GroupAggregates.increment(`League:${leagueID}`, {
      channels: -channels!,
    });
    console.log('Done updating GroupAggregates');
    // replace lockerRoom group
    const lockerRoomID = (await LockerRoom.findOneAndUpdate({group: clubGroup}, {group}).exec())!.id;
    console.log('Done updating Locker Room');
    // replace ChannelGroup group
    await ChannelGroup.updateMany({lockerRoomID}, {group});
    console.log('Done updating Channel Group');
    // replace group, groupType, groupID of UserRole
    await UserRole.updateMany({lockerRoomID}, {group, groupType: 'FanGroup', groupID: result.id});
    console.log('Done updating User Role');
    // replace data.group, group in UserInvites
    await UserInvites.updateMany({group: clubGroup}, {'data.group': group, group});
    console.log('Done updating User Invites');
    // delete club
    await Club.findByIdAndDelete(id).exec();
    console.log(`Done removing ${name} Club`);
  }
}
main('630c4922e20a7d3b663e1a43').then();
