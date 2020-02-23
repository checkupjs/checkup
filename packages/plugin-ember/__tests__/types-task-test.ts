import { EmberCLIFixturifyProject, stdout } from '@checkup/test-helpers';

import { TypesTask } from '../src/tasks';
import { TypesTaskResult } from '../src/results';

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
  let fixturifyProject: EmberCLIFixturifyProject;

  beforeEach(function() {
    fixturifyProject = new EmberCLIFixturifyProject('checkup-app', '0.0.0');
  });

  afterEach(function() {
    fixturifyProject.dispose();
  });

  it('returns all the types found in the app and outputs to the console', async () => {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.writeSync();

    const result = await new TypesTask({ path: fixturifyProject.baseDir }).run();
    const typesTaskResult = <TypesTaskResult>result;

    typesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('returns all the types (including nested) found in the app and outputs to the console', async () => {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    fixturifyProject.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    fixturifyProject.writeSync();

    const result = await new TypesTask({ path: fixturifyProject.baseDir }).run();
    const typesTaskResult = <TypesTaskResult>result;

    typesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('returns all the types found in the app and outputs to JSON', async () => {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.writeSync();

    const result = await new TypesTask({ path: fixturifyProject.baseDir }).run();
    const typesTaskResult = <TypesTaskResult>result;

    expect(typesTaskResult.toJson()).toMatchSnapshot();
  });

  it('returns all the types (including nested) found in the app and outputs to JSON', async () => {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    fixturifyProject.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    fixturifyProject.writeSync();

    const result = await new TypesTask({ path: fixturifyProject.baseDir }).run();
    const typesTaskResult = <TypesTaskResult>result;

    expect(typesTaskResult.toJson()).toMatchSnapshot();
  });
});
