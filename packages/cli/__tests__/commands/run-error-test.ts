import { CheckupConfig } from '@checkup/core';
import { CheckupProject } from '@checkup/test-helpers';
import { runCommand } from '../__utils__/run-command';

describe('@checkup/cli', () => {
  describe('cli error cases', () => {
    it('should error if no checkup config is present', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0');
      project.writeSync();

      await expect(
        runCommand(['run', '--cwd', project.baseDir])
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Could not find a checkup configuration starting from the given path: ${project.baseDir}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration."`
      );

      project.dispose();
    });

    it('should error if a plugin cannot be loaded', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig({
        plugins: ['unknown'],
        tasks: {},
      });
      project.writeSync();

      await expect(
        runCommand(['run', '--cwd', project.baseDir])
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Cannot find module 'checkup-plugin-unknown' from '${project.baseDir}'"`
      );

      project.dispose();
    });

    it('should error if the config is malformed', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig(({
        plugins: undefined,
        tasks: {},
      } as unknown) as CheckupConfig);
      project.writeSync();

      await expect(
        runCommand(['run', '--cwd', project.baseDir])
      ).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });
  });
});
