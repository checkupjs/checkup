import EslintDisableTask from './tasks/eslint-disable-task.js';
import EslintSummaryTask from './tasks/eslint-summary-task.js';
import OutdatedDependencyTask from './tasks/outdated-dependencies-task.js';
import LinesOfCodeTask from './tasks/lines-of-code-task.js';
import ValidEsmPackageTask from './tasks/valid-esm-package-task.js';
import { evaluateActions as evaluateESLintDisables } from './actions/eslint-disable-actions.js';
import { evaluateActions as evaluateESLintSummary } from './actions/eslint-summary-actions.js';
import { evaluateActions as evaluateOutdatedDependencies } from './actions/outdated-dependency-actions.js';

export default {
  tasks: {
    'eslint-summary': EslintSummaryTask,
    'eslint-disables': EslintDisableTask,
    'outdated-dependencies': OutdatedDependencyTask,
    'lines-of-code': LinesOfCodeTask,
    'valid-esm-package': ValidEsmPackageTask,
  },

  actions: {
    'eslint-disables': evaluateESLintDisables,
    'eslint-summary': evaluateESLintSummary,
    'outdated-dependencies': evaluateOutdatedDependencies,
  },
};
