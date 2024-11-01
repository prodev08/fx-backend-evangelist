import {Game, GamePartner} from 'lib-mongoose';
import slugify from '@sindresorhus/slugify';
import {gamePartnersWithIcons} from '../../utilities';

export default async function () {
  const partners: any = [];
  const games = await Game.find({}).exec();
  const gameCount = games.length;
  let i = 1;
  for (const game of games) {
    console.log(`${i}/${gameCount}`);
    const gameLinks = game.links;
    if (gameLinks) {
      for (const link of gameLinks) {
        if (partners.indexOf(link.source) === -1) {
          partners.push(link.source);
        }
      }
    }
    i++;
  }
  console.log('partners', partners);
  for (const name of partners) {
    const slug = slugify(name);
    //temporary
    let fields;
    if (gamePartnersWithIcons.includes(slug)) {
      fields = {
        name,
        slug,
        Icon: {objectType: 'Photo', objectID: slug},
        Logo: {objectType: 'Photo', objectID: slug},
      };
    } else {
      fields = {
        name,
        slug,
        Icon: null,
        Logo: null,
      };
    }
    await GamePartner.findOneAndUpdate({name}, fields, {upsert: true, new: true}).exec();
  }
}
