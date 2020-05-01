import * as t from 'io-ts';

export const RuntimeTaskConfig = t.union([
  t.literal('on'),
  t.literal('off'),
  t.union([
    t.literal('on'),
    t.literal('off'),
    t.tuple([t.union([t.literal('on'), t.literal('off')]), t.unknown]),
  ]),
]);

export const RuntimeCheckupConfig = t.type({
  plugins: t.array(t.string),
  tasks: t.record(t.string, RuntimeTaskConfig),
});
