import { EmberProject, stdout } from '@checkup/test-helpers';

import EmberTypesTask from '../src/tasks/ember-types-task';
import EmberTypesTaskResult from '../src/results/ember-types-task-result';

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

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to the console', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    typesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('returns all the types (including nested) found in the app and outputs to the console', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    project.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    typesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('returns all the types found in the app and outputs to JSON', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    expect(typesTaskResult.toJson()).toMatchSnapshot();
  });

  it('returns all the types (including nested) found in the app and outputs to JSON', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    project.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    expect(typesTaskResult.toJson()).toMatchSnapshot();
  });

  it('returns all the types found in the app and outputs to html', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    expect(typesTaskResult.html()).toMatchSnapshot();
  });

  it('returns all the types (including nested) found in the app and outputs to html', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    project.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    project.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    project.writeSync();

    const result = await new EmberTypesTask({ path: project.baseDir }).run();
    const typesTaskResult = <EmberTypesTaskResult>result;

    expect(typesTaskResult.html()).toMatchSnapshot();
  });
});
