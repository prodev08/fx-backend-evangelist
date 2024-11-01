import {objectType, list} from 'nexus';

const leagues = ['mlb', 'wnba', 'nba', 'ncaa', 'nhl', 'concacaf', 'efl', 'uefa', 'mls', 'epl'];

export const Game = objectType({
  name: 'Game',
  definition(t) {
    t.nonNull.string('sport');
    t.nonNull.int('gameID');
    t.nonNull.float('date');
    t.nonNull.int('points');
    t.int('team1ID');
    t.string('team1City');
    t.string('team1Name');
    t.int('team1Ranking');
    t.int('team1Score');
    t.string('team1Color');
    t.int('team2ID');
    t.string('team2City');
    t.string('team2Name');
    t.int('team2Ranking');
    t.int('team2Score');
    t.string('team2Color');
    t.string('location');
    t.string('headline');
    t.field('links', {type: list('Link')});
    t.string('timeLeft');
    t.string('competition');
    t.string('coverImage');
    t.string('pointsLevel');
    t.int('highPoints');
    t.string('leagueCode');
    t.boolean('isReminded');
    t.string('team1Nickname');
    t.string('team2Nickname');
    t.string('team1DisplayName');
    t.string('team2DisplayName');

    //dynamic
    t.nonNull.string('group', {
      resolve: async ({gameID}) => {
        return `Game:${gameID}`;
      },
    });

    //dynamic isLive
    t.nonNull.boolean('isLive', {
      resolve: async ({timeLeft}) => {
        return !!(timeLeft && !timeLeft?.includes('Final'));
      },
    });
  },
});

export const GameByLeague = objectType({
  name: 'GameByLeague',
  definition(t) {
    leagues.forEach(league => {
      t.field(league, {type: 'Games'});
    });
  },
});
