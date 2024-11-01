import {inputObjectType} from 'nexus';

export const InputCreateClub = inputObjectType({
  name: 'InputCreateClub',
  definition(t) {
    t.nonNull.string('name');
    t.field('Avatar', {type: 'InputMedia'});
    t.field('CoverPhoto', {type: 'InputMedia'});
    t.nonNull.list.nonNull.string('sportIDs');
    t.nonNull.string('leagueID');
  },
});

export const InputEditClub = inputObjectType({
  name: 'InputEditClub',
  definition(t) {
    t.nonNull.string('name');
    t.field('Avatar', {type: 'InputMedia'});
    t.field('CoverPhoto', {type: 'InputMedia'});
  },
});
