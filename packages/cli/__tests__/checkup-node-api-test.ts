import { Checkup } from '@checkup/cli';
import { CheckupProject } from '@checkup/test-helpers';
import { _registerTaskForTesting, _resetTasksForTesting } from '../src/commands/run';

const TEST_TIMEOUT = 100000;

describe('@checkup/cli', () => {
  describe('node API output', () => {
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
      'should output checkup result',
      async () => {
        let result = await Checkup.run(['--cwd', project.baseDir]);

        expect(result).toMatchSnapshot({
          runs: expect.any(Array),
        });
      },
      TEST_TIMEOUT
    );
  });
});
