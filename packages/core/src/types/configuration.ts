import * as t from 'io-ts';

import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';

import { PromiseValue } from 'type-fest';

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;

export enum CheckupConfigFormat {
  JSON = 'JSON',
  YAML = 'YAML',
  JavaScript = 'JavaScript',
}

export type CheckupConfigLoader = () => Promise<{
  format: CheckupConfigFormat;
  filepath: string;
  config: CheckupConfig;
}>;

export type ConfigMapper = (config: CheckupConfig) => CheckupConfig;

export type CosmiconfigServiceResult = PromiseValue<ReturnType<CheckupConfigLoader>> | null;
