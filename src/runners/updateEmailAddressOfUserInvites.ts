import '../initializers';
import {UserInvites} from 'lib-mongoose';

async function main() {
  let i = 1;
  const length = await UserInvites.countDocuments();
  const userInvites = await UserInvites.find().exec();
  for (const userInvite of userInvites) {
    console.log(`${i} of ${length}`);
    await UserInvites.findByIdAndUpdate(userInvite.id, {'data.emailAddress': userInvite.data.emailAddress.trim()});
    i++;
  }
  console.log('Done!');
}
main();
