import { CheckupConfig, CheckupConfigFormat, CosmiconfigLoaderFactory } from '../../src';
import CheckupFixturifyProject from '@checkup/test-helpers/lib/checkup-fixturify-project';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('cosmiconfig-loader-factory', () => {
  const formatToWriteMapper: Record<CheckupConfigFormat, (config: CheckupConfig) => string> = {
    JSON: config => JSON.stringify(config, null, 2),
    YAML: config => yaml.safeDump(config),
    JavaScript: config => `module.exports = ${JSON.stringify(config, null, 2)}`,
  };
  const defaultConfig = {
    plugins: [],
    tasks: {},
  };
  let project: CheckupFixturifyProject;

  beforeEach(() => {
    project = new CheckupFixturifyProject('test');
  });

  afterEach(() => {
    project.dispose();
  });

  it('should throw if a config file is not found in the given base path', async () => {
    await expect(
      CosmiconfigLoaderFactory(project.baseDir)()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Could not find a checkup configuration starting from the given path: ${project.baseDir}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration."`
    );
  });

  it.each([[CheckupConfigFormat.JSON], [CheckupConfigFormat.YAML]])(
    'should correctly load extensionless %s config files',
    async (configFormat: CheckupConfigFormat) => {
      project.files['.checkuprc'] = formatToWriteMapper[configFormat](defaultConfig);
      project.writeSync();

      const { config, filepath, format } = await CosmiconfigLoaderFactory(project.baseDir)();
      expect(config).toStrictEqual(defaultConfig);
      expect(filepath).toEqual(path.join(project.baseDir, '.checkuprc'));
      expect(format).toEqual(configFormat);
    }
  );

  it.each([
    ['.checkuprc.js', CheckupConfigFormat.JavaScript],
    ['.checkuprc.json', CheckupConfigFormat.JSON],
    ['.checkuprc.yml', CheckupConfigFormat.YAML],
    ['.checkuprc.yaml', CheckupConfigFormat.YAML],
    ['checkup.config.js', CheckupConfigFormat.JavaScript],
  ])(
    'should correctly load config files of type %s',
    async (filename: string, configFormat: CheckupConfigFormat) => {
      project.files[filename] = formatToWriteMapper[configFormat](defaultConfig);
      project.writeSync();

      const { config, filepath, format } = await CosmiconfigLoaderFactory(project.baseDir)();
      expect(config).toStrictEqual(defaultConfig);
      expect(filepath).toEqual(path.join(project.baseDir, filename));
      expect(format).toEqual(configFormat);
    }
  );
});
