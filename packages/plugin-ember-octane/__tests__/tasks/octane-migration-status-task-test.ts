import { EmberProject } from '@checkup/test-helpers';
import { OctaneMigrationStatusTask } from '../../src/tasks';

describe('octane-migration-status-task', () => {
  let project: EmberProject;

  beforeEach(function() {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function() {
    project.dispose();
  });

  test('it should execute on files', async () => {
    project.files = Object.assign(project.files, {
      app: {
        components: {
          'foo-bar.js': `
            import Component from '@glimmer/component';

            export default class FooBarComponent extends Component {}
          `,
        },
        services: {
          'my-service.js': `
            import Service from '@ember/service';

            export default class MyServiceService extends Service {}
          `,
        },
      },
    });

    project.writeSync();

    let task = new OctaneMigrationStatusTask({ path: project.baseDir });
    let taskResult = await task.run();
    let { results, errorCount } = taskResult.esLintReport;

    expect(results).toHaveLength(2);
    expect(errorCount).toBe(0);
  });
});
