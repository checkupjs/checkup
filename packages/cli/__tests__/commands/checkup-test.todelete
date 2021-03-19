import { CheckupProject } from '@checkup/test-helpers';
import { run } from '../__utils__/run';

const TEST_TIMEOUT = 100000;

describe('@checkup/cli', () => {
  describe('normal cli output', () => {
    let project: CheckupProject;

    beforeEach(function () {
      project = new CheckupProject('checkup-app', '0.0.0', (project) => {
        project.addDependency('react', '^15.0.0');
        project.addDependency('react-dom', '^15.0.0');
      });
      project.files['index.js'] = 'module.exports = {};';
      project.files['index.hbs'] = '<div>Checkup App</div>';

      project.addCheckupConfig({
        plugins: [],
        tasks: {},
      });
      project.writeSync();
      project.gitInit();
      project.install();
    });

    afterEach(function () {
      project.dispose();
    });

    it(
      'should output checkup help text',
      async () => {
        let result = await run([], {
          cwd: project.baseDir,
        });

        expect(result.stdout).toMatch('A health checkup for your project');
        expect(result.stdout).toMatch('VERSION');
        expect(result.stdout).toMatch(/@checkup\/cli\/\d*\.\d*\.\d*\s.*/);
        expect(result.stdout).toMatch('USAGE');
        expect(result.stdout).toMatch('$ checkup [COMMAND]');
        expect(result.stdout).toMatch('COMMANDS');
        expect(result.stdout).toMatch('generate  Runs a generator to scaffold Checkup code');
        expect(result.stdout).toMatch('run       Runs information-based tasks');
      },
      TEST_TIMEOUT
    );
  });
});
