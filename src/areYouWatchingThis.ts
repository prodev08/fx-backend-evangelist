// eslint-disable-next-line node/no-extraneous-import
import axios from 'axios';
import {IGame, ILink} from './interfaces/IGame';
import 'dotenv/config';

// const host = global.areYouWatchingThisURL;
// const apiKey = global.areYouWatchingThisAPIKey;
const host = process.env.ARE_YOU_WATCHING_THIS_URL;
const apiKey = process.env.ARE_YOU_WATCHING_THIS_API_KEY;

const gameUrl = `${host}/games.json`;
const providerUrl = `${host}/providers.json`;
const airingUrl = `${host}/airings.json`;
const linkUrl = `${host}/links.json`;
const assetUrl = `${host}/assets.json`;

const getData = (url: string) => async (params: any) => {
  try {
    const {data} = await axios.get(url, {
      params: {
        ...params,
        apiKey,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return data.results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getDataWithMultiParams = (url: string) => async (params: any) => {
  try {
    const {data} = await axios.get(url, {
      params,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return data.results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const apiGames = getData(gameUrl);
export const apiProviders = getData(providerUrl);
export const apiAirings = getData(airingUrl);
export const apiLinks = getData(linkUrl);
export const apiAssets = getData(assetUrl);
export const getImageUrl = (id: string | number) => `https://fx1.static.areyouwatchingthis.com/images/assets/${id}.jpg`;

export const getGames = async (params: any): Promise<IGame[]> => {
  interface ILeagues {
    [key: string]: string;
  }

  const leagues: ILeagues = {
    mlb: 'Baseball',
    nba: 'Basketball',
    wnba: 'Basketball',
    ncaab: 'Basketball',
    nhl: 'Ice Hockey',
  };
  const soccerLeagues: string[] = ['scna', 'soefl', 'scb', 'som', 'soe'];
  const soccerLeagueTo: ILeagues = {
    scna: 'concacaf',
    soefl: 'efl',
    scb: 'uefa',
    som: 'mls',
    soe: 'epl',
  };

  try {
    const games: IGame[] = await apiGames(params);
    const newGames: IGame[] = [];

    const isFake = process.argv.find(arg => arg.includes('--fake'));
    if (isFake) {
      // Creating mock data, not real data.
      let startGameID = Math.floor(Math.random() * 5000000);
      const leaguesForFake: ILeagues = {
        mlb: 'Baseball',
        nba: 'Basketball',
        wnba: 'Basketball',
        ncaab: 'Basketball',
        nhl: 'Ice Hockey',
        mls: 'Soccer',
        uefa: 'Soccer',
        efl: 'Soccer',
        epl: 'Soccer',
        concacaf: 'Soccer',
      };
      const leagueCodes: string[] = Object.keys(leaguesForFake);
      for (let i = 0; i < leagueCodes.length; i += 1) {
        if (games[i]) {
          let game = games[i];

          const gameDetailResults = await apiGames({gameID: game.gameID});
          if (gameDetailResults.length > 0) {
            game = {...game, ...gameDetailResults[0]};
          }

          const results = await apiLinks({gameID: game.gameID});
          let links: ILink[] = [];
          results.forEach((result: any) => {
            if (result.links?.length > 0) {
              links = links.concat(...result.links);
              links = links.filter(link => link.type !== 'audio');
            }
          });
          game.links = links;

          const assets = await apiAssets({gameID: game.gameID});
          if (assets.length > 0) game.coverImage = getImageUrl(assets[0].assetID);

          game.sport = leagues[leagueCodes[i]];
          game.leagueCode = leagueCodes[i];
          if (i === 0) game.isFeatured = true;

          // Set team displayname.
          game.team1DisplayName = game.team1Name || game.team1Nickname || game.team1City;
          game.team2DisplayName = game.team2Name || game.team2Nickname || game.team2City;
          if (!game.team1DisplayName || !game.team2DisplayName) continue;

          for (let j = 0; j < 3; j += 1) {
            game.points = Math.floor(Math.random() * 275);
            game.date = new Date().getTime() + Math.floor(Math.random() * 3600000 * 24 * 5);
            game.gameID = startGameID;
            startGameID += 1;
            if (j === 0) game.timeLeft = '30';
            else game.timeLeft = '';
            newGames.push({...game});
          }
        }
      }
    } else {
      // Creating real data.
      for (let game of games) {
        if (!/^Final/.test(game.timeLeft || '')) {
          const gameDetailResults = await apiGames({gameID: game.gameID});
          if (gameDetailResults.length > 0) {
            game = {...game, ...gameDetailResults[0]};
          }

          let links: ILink[] = [];
          const results = await apiLinks({gameID: game.gameID});
          results.forEach((result: any) => {
            if (result.links?.length > 0) {
              links = links.concat(...result.links);
            }
          });
          game.links = links;

          const assets = await apiAssets({gameID: game.gameID});
          if (assets.length > 0) game.coverImage = getImageUrl(assets[0].assetID);

          // Change game sport and game leagueCode to have exact meaning.
          if (game.sport === 'soccer') {
            const isAvailLeague = soccerLeagues.find(league => league === game.leagueCode?.toLowerCase());
            if (!isAvailLeague) continue;
            game.sport = 'Soccer';
            game.leagueCode = soccerLeagueTo[isAvailLeague];
          } else {
            game.leagueCode = game.sport;
            game.sport = leagues[game.sport];
          }

          // Set team displayname.
          game.team1DisplayName = game.team1Name || game.team1Nickname || game.team1City;
          game.team2DisplayName = game.team2Name || game.team2Nickname || game.team2City;
          if (!game.team1DisplayName || !game.team2DisplayName) continue;

          newGames.push(game);
        }
      }
    }
    return newGames;
  } catch (error: any) {
    console.log(error.message);
  }
  return [];
};
