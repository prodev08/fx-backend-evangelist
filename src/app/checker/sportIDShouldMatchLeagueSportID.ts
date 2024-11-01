import {League} from 'lib-mongoose';

export default async function (sportIDs: string[], leagueID: string) {
  const leagueSportID = (await League.findById(leagueID).exec())!.sportIDs!;

  if (sportIDs[0] !== leagueSportID[0]) {
    throw new Error('Inputted Sport ID does not matched the Sport ID for the League.');
  }
}
