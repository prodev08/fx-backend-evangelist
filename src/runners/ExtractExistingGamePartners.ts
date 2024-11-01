import '../initializers';
import createGamePartner from '../app/creator/createGamePartner';
import {GamePartner} from 'lib-mongoose';

async function main() {
  await GamePartner.deleteMany({});
  await createGamePartner();
  console.log('Done!');
}

main();
