import * as t from 'io-ts';

export const RuntimeTaskConfig = t.union([t.boolean, t.object]);

export const RuntimeCheckupConfig = t.type({
  plugins: t.array(t.string),
  tasks: t.record(t.string, RuntimeTaskConfig),
});
