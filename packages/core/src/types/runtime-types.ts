import * as t from 'io-ts';

export const RuntimeTaskConfig = t.type({
  isEnabled: t.boolean,
});

export const RuntimeCheckupConfig = t.type({
  plugins: t.array(t.string),
  tasks: t.record(t.string, RuntimeTaskConfig),
});
