import { EmberProject, getTaskContext } from '@checkup/test-helpers';

import OctaneMigrationStatusTask from '../../src/tasks/octane-migration-status-task';
import { getPluginName } from '@checkup/core';

describe('octane-migration-status-task', () => {
  let project: EmberProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function () {
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

    let task = new OctaneMigrationStatusTask(pluginName, getTaskContext({ path: project.baseDir }));
    let taskResult = await task.run();
    let { results, errorCount } = taskResult.esLintReport;

    expect(results).toHaveLength(2);
    expect(errorCount).toBe(0);
  });
});
