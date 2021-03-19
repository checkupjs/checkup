import * as stringify from 'json-stable-stringify';

import { CheckupProject } from '@checkup/test-helpers';
import { runCommand } from '../../src/run-command';
import { white } from 'chalk';

describe('@checkup/cli', () => {
  describe('error cases', () => {
    let project: CheckupProject;

    beforeEach(function () {
      project = new CheckupProject('checkup-app', '0.0.0');
    });

    afterEach(function () {
      project.dispose();
    });

    it('should correctly report error when no config detected', async () => {
      await expect(
        runCommand(['run', '--cwd', project.baseDir], { testing: true })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        // eslint-disable-next-line jest/no-interpolation-in-snapshots
        `"Could not find a checkup config in the given path: ${project.baseDir}/.checkuprc."`
      );
    });

    it('should correctly report error when config contains invalid key', async () => {
      project.files['.checkuprc'] = stringify({
        plugins: [],
        task: {},
      });
      project.writeSync();

      await expect(
        runCommand(['run', '--cwd', project.baseDir], { testing: true })
      ).rejects.toThrow(
        `Config in ${project.baseDir}/.checkuprc is invalid.

${white.bold('Details')}: data should have required property 'tasks'.`
      );
    });

    it('should correctly report error when config contains invalid value', async () => {
      project.files['.checkuprc'] = stringify({
        plugins: [],
        tasks: [],
      });
      project.writeSync();

      await expect(
        runCommand(['run', '--cwd', project.baseDir], { testing: true })
      ).rejects.toThrow(
        `Config in ${project.baseDir}/.checkuprc is invalid.

${white.bold('Details')}: data.tasks should be object.`
      );
    });

    it('should correctly report error if task not found', async () => {
      project.addCheckupConfig();
      project.writeSync();

      await expect(
        runCommand(['run', '--task', 'foo', '--cwd', project.baseDir], { testing: true })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Cannot find the foo task."`);
    });
  });
});
