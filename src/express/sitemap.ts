import {
  LockerRoom,
  LockerRoomDocument,
  ChannelGroup,
  Channel,
  ChannelGroupDocument,
  ChannelDocument,
} from 'lib-mongoose';
import {flatten} from 'lodash';
import {Express} from 'express';

export default function (app: Express) {
  app.get('/sitemap', async (req: any, res: any) => {
    const results = await Promise.all(
      (
        await LockerRoom.find({group: {$not: /^Game:/}}, {slug: 1, id: 1}).exec()
      ).map(async (lockerRoomItem: LockerRoomDocument) => {
        const channelGroupIDs = (await ChannelGroup.find({lockerRoomID: lockerRoomItem.id}, {id: 1}).exec()).map(
          (channelGroupItem: ChannelGroupDocument) => channelGroupItem.id.toString()
        );
        return (await Channel.find({channelGroupID: {$in: channelGroupIDs}, isDeleted: false}, {slug: 1}).exec()).map(
          (channelItem: ChannelDocument) => {
            return `/locker-room/${lockerRoomItem.slug}/${channelItem.slug}`;
          }
        );
      })
    );
    res.json(flatten(results));
  });
}
