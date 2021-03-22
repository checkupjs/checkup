import { EmberProject, getTaskContext } from '@checkup/test-helpers';

import EmberOctaneMigrationStatusTask from '../src/tasks/ember-octane-migration-status-task';
import { getPluginName } from '@checkup/core';

describe('ember-octane-migration-status-task', () => {
  let project: EmberProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
    project.addCheckupConfig({
      plugins: ['ember', 'ember-octane'],
    });
    project.addDevDependency('checkup-plugin-ember', '0.2.3');
  });

  afterEach(function () {
    project.dispose();
  });

  [
    {
      variant: 'non-octane',
      setup: createNonOctaneProject,
    },
    {
      variant: 'octane',
      setup: createOctaneProject,
    },
  ].forEach((testConfig) => {
    ['app', 'addon'].forEach((type: string) => {
      test(`detects octane migration status for ${testConfig.variant} ${type} and outputs to json`, async () => {
        testConfig.setup(project, type);

        const result = await new EmberOctaneMigrationStatusTask(
          pluginName,
          getTaskContext({
            options: { cwd: project.baseDir },
            paths: project.filePaths,
          })
        ).run();

        expect(result).toMatchSnapshot();
      });
    });
  });
});

function createNonOctaneProject(project: EmberProject, type: string) {
  project.files = {
    [type]: {
      components: {
        'my-component.js': `
        import Component from '@ember/component';
        import BarMixin from './bar-mixin';
        import BazMixin from './baz-mixin';

        export default Component.extend(BarMixin, BazMixin, {
          someProp: '',

          didInsertElement() {
            let prop = this.get('someProp');

            bar(prop);
          },

          actions: {
            foobar() {
              doFoo();
            }
          }
        });
        `,
        'other-component.js': `
        import Component from '@ember/component';
        import BarMixin from './bar-mixin';
        import BazMixin from './baz-mixin';

        export default Component.extend(BarMixin, BazMixin, {
          someProp: '',

          didInsertElement() {
            let prop = this.get('someProp');

            bar(prop);
          },

          actions: {
            foobar() {
              doFoo();
            }
          }
        });
        `,
      },
      services: {
        'my-service.js': `
        import Service from '@ember/service';

        export default Service.extend({
          dog: 'rover',

          bleh() {
            let rover = this.get('dog');
          }
        });
        `,
        'other-service.js': `
        import Service from '@ember/service';
        import

        export default class OtherService {
          dog: 'rover';

          bigDog: computed('dog', function() {
            return 'big' + this.dog;
          });

          bleh() {
            let rover = this.dog;
          }
        }
        `,
      },
      routes: {
        'my-route.js': `
        import Route from '@ember/routing/route';

        export default Route.extend({
        });
        `,
      },
      templates: {
        'application.hbs': `
          {{my-component someArg=foo}}
          {{other-component anotherArg=bar}}
        `,
        'my-component.hbs': `
          <button {{action "foobar"}}>Make it foo</button>
          {{someProp}}
        `,
        'other-component.hbs': `
          {{someProp}}
        `,
      },
    },
  };

  project.writeSync();
}

function createOctaneProject(project: EmberProject, type: string) {
  project.files = {
    [type]: {
      components: {
        'my.js': `
          import Component from '@glimmer/component';
          import { action } from '@ember/object';

          export default class MyComponent extends Component {
            @action
            foobar() {
              doFoo();
            }
          }
        `,
        'other.js': `
          import Component from '@glimmer/component';

          export default class OtherComponent extends Component {
          }
        `,
        services: {
          'my.js': `
            import Service from '@ember/service';

            export default class MyServiceService extends Service {
            }
          `,
        },
        templates: {
          'application.hbs': `
          <My @someArg=foo />
          <Other @anotherArg=bar />
        `,
          'my-component.hbs': `
          <button {{on "click" this.foobar}}>Make it foo</button>
          {{this.someProp}}
        `,
          'other-component.hbs': `
          {{this.someProp}}
        `,
        },
      },
    },
  };

  project.writeSync();
}
