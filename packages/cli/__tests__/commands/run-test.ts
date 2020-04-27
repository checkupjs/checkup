import * as fs from 'fs';
import * as path from 'path';

import { CheckupProject, createTmpDir, stdout } from '@checkup/test-helpers';

import { CheckupConfig } from '@checkup/core';

import cmd = require('../../src');

const TEST_TIMEOUT = 100000;

describe('@checkup/cli', () => {
  describe('normal cli output with plugins', () => {
    let project: CheckupProject;

    beforeEach(function () {
      project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig({
        plugins: [],
        tasks: {},
      });

      project.writeSync();
    });

    afterEach(function () {
      project.dispose();
    });

    it(
      'should output checkup result',
      async () => {
        await cmd.run(['run', project.baseDir]);

        expect(stdout()).toMatchSnapshot();
      },
      TEST_TIMEOUT
    );

    it('should output checkup result in JSON', async () => {
      await cmd.run(['run', '--reporter', 'json', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it(
      'should output an html file in the current directory if the html reporter option is provided',
      async () => {
        await cmd.run(['run', '--reporter', 'html', project.baseDir]);

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(
          /^(.*)\/checkup-report-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\.html/
        );
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      TEST_TIMEOUT
    );

    it(
      'should output an html file in a custom directory if the html reporter and reporterOutputPath options are provided',
      async () => {
        let tmp = createTmpDir();

        await cmd.run(['run', '--reporter', 'html', `--reportOutputPath`, tmp, project.baseDir]);

        let outputPath = stdout().trim();

        expect(outputPath).toMatch(
          /^(.*)\/checkup-report-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\.html/
        );
        expect(fs.existsSync(outputPath)).toEqual(true);

        fs.unlinkSync(outputPath);
      },
      TEST_TIMEOUT
    );

    it('should run a single task if the task option is specified', async () => {
      await cmd.run(['run', '--task', 'project', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should use the config at the config path if provided', async () => {
      const anotherProject = new CheckupProject('another-project').addCheckupConfig({
        plugins: [],
        tasks: {},
      });
      anotherProject.writeSync();
      await cmd.run([
        'run',
        '--config',
        path.join(anotherProject.baseDir, '.checkuprc'),
        project.baseDir,
      ]);

      expect(stdout()).toMatchSnapshot();
      anotherProject.dispose();
    });
  });

  describe('cli error cases', () => {
    it('should error if no checkup config is present', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0');
      project.writeSync();

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Could not find a checkup configuration starting from the given path: ${project.baseDir}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration."`
      );

      project.dispose();
    });

    it('should error if a plugin cannot be loaded', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig({
        plugins: ['@checkup/unknown-plugin'],
        tasks: {},
      });
      project.writeSync();

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Cannot find module '@checkup/unknown-plugin' from '${project.baseDir}'"`
      );

      project.dispose();
    });

    it('should error if the config is malformed', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig(({
        plugins: undefined,
        tasks: {
          someTask: {
            isEnabled: 'foo',
          },
        },
      } as unknown) as CheckupConfig);
      project.writeSync();

      await expect(cmd.run(['run', project.baseDir])).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });
  });
});
