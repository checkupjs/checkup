import { CheckupConfigFormat, CosmiconfigLoaderFactory } from '../../src';
import { CheckupProject } from '@checkup/test-helpers';
import * as path from 'path';

describe('cosmiconfig-loader-factory', () => {
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

  it('should throw if a config file is not found in the given base path', async () => {
    project.writeSync();
    await expect(
      CosmiconfigLoaderFactory(project.baseDir)()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Could not find a checkup configuration starting from the given path: ${project.baseDir}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration."`
    );
  });

  it('should return the config if found', async () => {
    project.addCheckupConfig(defaultConfig).writeSync();
    const config = await CosmiconfigLoaderFactory(project.baseDir)();

    expect(config).toStrictEqual({
      format: CheckupConfigFormat.JSON,
      filepath: path.join(project.baseDir, '.checkuprc'),
      config: defaultConfig,
    });
  });
});
