import {LockerRoom, LockerRoomDocument, UserRole, UserRoleDocument} from 'lib-mongoose';
import {compact} from 'lodash';

export default async function (uid: string): Promise<LockerRoomDocument[]> {
  // return compact(
  //   await Promise.all(
  //     (
  //       await UserRole.aggregate([
  //         {$match: {uid}},
  //         {
  //           $addFields: {
  //             rank: {
  //               $switch: {
  //                 branches: [
  //                   {case: {$eq: ['$groupType', 'League']}, then: 1},
  //                   {case: {$eq: ['$groupType', 'Club']}, then: 2},
  //                   {case: {$eq: ['$groupType', 'FanGroup']}, then: 3},
  //                 ],
  //                 default: 4,
  //               },
  //             },
  //           },
  //         },
  //       ])
  //         .sort({rank: 1, updatedAt: 1})
  //         .exec()
  //     ).map(async (item: UserRoleDocument) => {
  //       return await LockerRoom.findById(item.lockerRoomID).exec();
  //     })
  //   )
  // );
  return compact(
    await Promise.all(
      (
        await UserRole.find({uid: uid}).sort({updatedAt: 1}).exec()
      ).map(async (item: UserRoleDocument) => {
        return await LockerRoom.findById(item.lockerRoomID).exec();
      })
    )
  );
}
