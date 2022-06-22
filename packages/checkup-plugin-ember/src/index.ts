import EmberDependenciesTask from './tasks/ember-dependencies-task.js';
import EmberInRepoAddonsEnginesTask from './tasks/ember-in-repo-addons-engines-task.js';
import EmberTestTypesTaskTask from './tasks/ember-test-types-task.js';
import EmberTypesTask from './tasks/ember-types-task.js';
import EmberTemplateLintDisableTask from './tasks/ember-template-lint-disable-task.js';
import EmberTemplateLintSummaryTask from './tasks/ember-template-lint-summary-task.js';
import EmberOctaneMigrationStatusTask from './tasks/ember-octane-migration-status-task.js';
import { evaluateActions as evaluateTemplateLintDisables } from './actions/ember-template-lint-disable-actions.js';
import { evaluateActions as evaluateTemplateLintSummary } from './actions/ember-template-lint-summary-actions.js';
import { evaluateActions as evaluateTestTypes } from './actions/ember-test-types-actions.js';

export default {
  tasks: {
    'ember-types': EmberTypesTask,
    'ember-dependencies': EmberDependenciesTask,
    'ember-in-repo-addons-engines': EmberInRepoAddonsEnginesTask,
    'ember-test-types': EmberTestTypesTaskTask,
    'ember-template-lint-disables': EmberTemplateLintDisableTask,
    'ember-template-lint-summary': EmberTemplateLintSummaryTask,
    'ember-octane-migration-status': EmberOctaneMigrationStatusTask,
  },
  actions: {
    'ember-template-lint-disables': evaluateTemplateLintDisables,
    'ember-template-lint-summary': evaluateTemplateLintSummary,
    'ember-test-types': evaluateTestTypes,
  },
};
