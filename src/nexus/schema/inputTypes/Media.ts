import {inputObjectType} from 'nexus';

export const InputMedia = inputObjectType({
  name: 'InputMedia',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
  },
});

export const InputQueryMedia = inputObjectType({
  name: 'InputQueryMedia',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
    t.nonNull.boolean('isSport');
    t.string('type');
  },
});
