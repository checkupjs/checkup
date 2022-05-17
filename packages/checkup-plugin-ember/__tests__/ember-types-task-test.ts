import '@microsoft/jest-sarif';
import { EmberProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import EmberTypesTask from '../src/tasks/ember-types-task';

const TYPES = {
  components: {
    'my-component.js': '',
  },
  controllers: {
    'my-controller.js': '',
  },
  helpers: {
    'my-helper.js': '',
  },
  initializers: {
    'my-initializer.js': '',
  },
  'instance-initializers': {
    'my-helper.js': '',
  },
  mixins: {
    'my-mixin.js': '',
  },
  models: {
    'my-model.js': '',
  },
  routes: {
    'my-route.js': '',
  },
  services: {
    'my-service.js': '',
  },
  templates: {
    'my-component.hbs': '',
  },
};

describe('types-task', () => {
  let project: EmberProject;
  let pluginName = getPluginName(import.meta.url);

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to JSON', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.writeSync();

    const results = await new EmberTypesTask(
      pluginName,
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });

  it('returns all the types (including nested) found in the app and outputs to JSON', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.addInRepoAddon('ember-super-button', 'latest');

    (project.files.lib as any)['ember-super-button'].addon = TYPES;

    project.writeSync();

    const results = await new EmberTypesTask(
      pluginName,
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });
});
