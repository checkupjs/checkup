import { stdout, CheckupProject, Plugin } from '@checkup/test-helpers';
import cmd = require('../src');

describe('@checkup/cli', () => {
  describe('base cases', () => {
    let project: CheckupProject;

    beforeEach(function() {
      const plugin = new Plugin.PluginBuilder('@checkup/plugin-mock')
        .addTask('mockTask', {
          async run() {
            return Promise.resolve({
              toJson() {
                return {
                  mockTask: 5,
                };
              },
              toConsole() {
                process.stdout.write('mock task is being run\n');
              },
            });
          },
        })
        .addTask('mockTask2', {
          async run() {
            return Promise.resolve({
              toJson() {
                return {
                  mockTask2: 10,
                };
              },
              toConsole() {
                process.stdout.write('mock task2 is being run\n');
              },
            });
          },
        })
        .build();
      project = new CheckupProject('checkup-project', '0.0.0')
        .addCheckupConfig({
          plugins: ['@checkup/plugin-mock'],
          tasks: {},
        })
        .addPlugin(plugin);
      project.writeSync();
    });

    afterEach(function() {
      project.dispose();
    });

    it('should output checkup result', async () => {
      await cmd.run([project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });

    it('should output checkup result in JSON', async () => {
      await cmd.run(['--json', project.baseDir]);

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('error cases', () => {
    it('should error if no checkup config is present', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0');
      project.writeSync();

      await expect(cmd.run([project.baseDir])).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });

    it('should error if a plugin cannot be loaded', async () => {
      const project = new CheckupProject('checkup-project', '0.0.0').addCheckupConfig({
        plugins: ['@checkup/unknown-plugin'],
        tasks: {},
      });
      project.writeSync();

      await expect(cmd.run([project.baseDir])).rejects.toThrowErrorMatchingSnapshot();

      project.dispose();
    });
  });
});
