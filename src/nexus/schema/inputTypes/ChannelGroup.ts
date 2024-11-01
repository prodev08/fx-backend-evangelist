import {inputObjectType} from 'nexus';

export const InputCreateChannelGroup = inputObjectType({
  name: 'InputCreateChannelGroup',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.string('lockerRoomID');
  },
});

export const InputEditChannelGroup = inputObjectType({
  name: 'InputEditChannelGroup',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
  },
});
