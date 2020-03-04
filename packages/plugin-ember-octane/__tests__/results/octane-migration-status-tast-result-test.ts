import { EmberProject, stdout } from '@checkup/test-helpers';
import { OctaneMigrationStatusTask } from '../../src/tasks';
import { OctaneMigrationStatusTaskResult } from '../../src/results';

describe('octane-migration-status-task-result', () => {
  let project: EmberProject;

  beforeEach(function() {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function() {
    project.dispose();
  });

  describe('console output', () => {
    test('output to console', async () => {
      project.files = Object.assign(project.files, {
        app: {
          components: {
            'foo-bar.js': `
              import Component from '@glimmer/component';

              export default class FooBarComponent extends Component {}
            `,
          },
        },
      });

      project.writeSync();
      let task = new OctaneMigrationStatusTask({ path: project.baseDir });

      await task.run();

      let { report } = task;
      let taskResult = new OctaneMigrationStatusTaskResult('sdsds', report);

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });
  });
});
