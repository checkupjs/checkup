import { CheckupConfigFormat, getFilepathLoader } from '../../src';
import { CheckupProject } from '@checkup/test-helpers';
import * as path from 'path';

describe('get-filepath-loader', () => {
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

  it('should throw if a config file is not found at the given filepath', async () => {
    project.writeSync();
    await expect(
      getFilepathLoader(path.join(project.baseDir, '.checkuprc'))()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Could not find checkup configuration file at ${path.join(project.baseDir, '.checkuprc')}"`
    );
  });

  it('should return the config if found', async () => {
    project.addCheckupConfig(defaultConfig).writeSync();
    const config = await getFilepathLoader(path.join(project.baseDir, '.checkuprc'))();

    expect(config).toStrictEqual({
      format: CheckupConfigFormat.JSON,
      filepath: path.join(project.baseDir, '.checkuprc'),
      config: defaultConfig,
    });
  });
});
