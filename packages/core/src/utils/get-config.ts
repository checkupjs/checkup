import * as t from 'io-ts';

import { CheckupConfig } from '../types';
import { RuntimeCheckupConfig } from '../types/runtime-types';
import { cosmiconfig } from 'cosmiconfig';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

const validateConfig = <A>(v: t.Validation<A>): Array<string> => {
  return pipe(
    v,
    fold(
      errors => {
        const errorString = errors
          .map(error => error.context)
          .map(
            contexts =>
              `${contexts
                .map(context => context.key)
                .filter(Boolean)
                .join('.')} expected type ${
                contexts.slice(-1)[0].type.name
              }, but got ${JSON.stringify(contexts.slice(-1)[0].actual)}`
          )
          .join('\n');
        throw new Error(`Checkup configuration is malformed:\n${errorString}`);
      },
      () => ['no errors']
    )
  );
};

/**
 * Get the checkup config via {@link cosmiconfig#search}
 * @param {string} basePath - the base path to start the config search
 * @return {Promise<CheckupConfig>} the parsed config file, if found, else throw
 */
export async function getConfig(basePath: string): Promise<CheckupConfig> {
  const configResult = await cosmiconfig('checkup').search(basePath);

  if (configResult === null) {
    throw new Error(
      `Could not find a checkup configuration starting from the given path: ${basePath}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration.`
    );
  }

  return validateConfig(RuntimeCheckupConfig.decode(configResult.config)) && configResult.config;
}
