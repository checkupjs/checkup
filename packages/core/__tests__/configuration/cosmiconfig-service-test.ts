import { CheckupConfig, CheckupConfigFormat } from '../../src';
import { CheckupProject } from '@checkup/test-helpers';
import * as path from 'path';
import * as yaml from 'js-yaml';
import CosmiconfigService from '../../src/configuration/cosmiconfig-service';

describe('cosmiconfig-service-factory', () => {
  const formatToWriteMapper: Record<CheckupConfigFormat, (config: CheckupConfig) => string> = {
    JSON: config => JSON.stringify(config, null, 2),
    YAML: config => yaml.safeDump(config),
    JavaScript: config => `module.exports = ${JSON.stringify(config, null, 2)}`,
  };
  const defaultConfig = {
    plugins: [],
    tasks: {},
  };
  let project: CheckupProject;

  beforeEach(() => {
    project = new CheckupProject('test');
  });

  afterEach(() => {
    project.dispose();
  });

  it('should throw if config file is not found via load', async () => {
    project.writeSync();
    const result = new CosmiconfigService().load(path.join(project.baseDir, '.checkuprc'));

    await expect(result).rejects.toMatchInlineSnapshot(
      `[Error: ENOENT: no such file or directory, open '${path.join(
        project.baseDir,
        '.checkuprc'
      )}']`
    );
  });

  it('should return null if config file is not found via search', async () => {
    project.writeSync();
    const result = await new CosmiconfigService().search(project.baseDir);
    expect(result).toBeNull();
  });

  it.each([[CheckupConfigFormat.JSON], [CheckupConfigFormat.YAML]])(
    'should correctly search extensionless %s config files',
    async (configFormat: CheckupConfigFormat) => {
      project.files['.checkuprc'] = formatToWriteMapper[configFormat](defaultConfig);
      project.writeSync();

      const maybeConfig = await new CosmiconfigService().search(project.baseDir);
      expect(maybeConfig?.config).toStrictEqual(defaultConfig);
      expect(maybeConfig?.filepath).toEqual(path.join(project.baseDir, '.checkuprc'));
      expect(maybeConfig?.format).toEqual(configFormat);
    }
  );

  it.each([
    ['.checkuprc.js', CheckupConfigFormat.JavaScript],
    ['.checkuprc.json', CheckupConfigFormat.JSON],
    ['.checkuprc.yml', CheckupConfigFormat.YAML],
    ['.checkuprc.yaml', CheckupConfigFormat.YAML],
    ['checkup.config.js', CheckupConfigFormat.JavaScript],
  ])(
    'should correctly search config files of type %s',
    async (filename: string, configFormat: CheckupConfigFormat) => {
      project.files[filename] = formatToWriteMapper[configFormat](defaultConfig);
      project.writeSync();

      const maybeConfig = await new CosmiconfigService().search(project.baseDir);
      expect(maybeConfig?.config).toStrictEqual(defaultConfig);
      expect(maybeConfig?.filepath).toEqual(path.join(project.baseDir, filename));
      expect(maybeConfig?.format).toEqual(configFormat);
    }
  );

  it.each([[CheckupConfigFormat.JSON], [CheckupConfigFormat.YAML]])(
    'should correctly load extensionless %s config files',
    async (configFormat: CheckupConfigFormat) => {
      project.files['.checkuprc'] = formatToWriteMapper[configFormat](defaultConfig);
      project.writeSync();

      const maybeConfig = await new CosmiconfigService().load(
        path.join(project.baseDir, '.checkuprc')
      );
      expect(maybeConfig?.config).toStrictEqual(defaultConfig);
      expect(maybeConfig?.filepath).toEqual(path.join(project.baseDir, '.checkuprc'));
      expect(maybeConfig?.format).toEqual(configFormat);
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

      const maybeConfig = await new CosmiconfigService().load(path.join(project.baseDir, filename));
      expect(maybeConfig?.config).toStrictEqual(defaultConfig);
      expect(maybeConfig?.filepath).toEqual(path.join(project.baseDir, filename));
      expect(maybeConfig?.format).toEqual(configFormat);
    }
  );
});
