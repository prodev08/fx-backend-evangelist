import {GameModel} from 'lib-mongoose';
import {apiLinks} from '../../areYouWatchingThis';
import getUser from './getUser';

export default async function (uid: string, games: any[] | any) {
  const user = await getUser(uid);
  if (user && user?.zipCode) {
    const results = await apiLinks({postalCode: user.zipCode});
    if (results.length > 0) {
      const mapLinks = results.map((link: any) => link.gameID);

      // If we have links replace the ones in that particular game
      if (Array.isArray(games)) {
        games = games.map((game: GameModel) => {
          const link = results[mapLinks.indexOf(game.gameID)];

          if (link) {
            console.log(game.gameID);

            game.links = link.links;
          }

          return game;
        });
      } else {
        const link = results[mapLinks.indexOf(games.gameID)];

        if (link) {
          console.log(games.gameID);

          games.links = link.links;
        }
      }
    }
  }
  return games;
}
