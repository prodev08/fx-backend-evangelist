import sportIDShouldOnlyBeOne from './sportIDShouldOnlyBeOne';
import sportIDExists from './sportIDExists';

export default async function (ids: string[]) {
  // check if sportID length is 1
  sportIDShouldOnlyBeOne(ids);
  // check if sportID exists, else throw error
  await sportIDExists(ids);
}
