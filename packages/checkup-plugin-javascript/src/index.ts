import { RegistrationArgs, getPluginName } from '@checkup/core';

import EslintDisableTask from './tasks/eslint-disable-task.js';
import EslintSummaryTask from './tasks/eslint-summary-task.js';
import OutdatedDependencyTask from './tasks/outdated-dependencies-task.js';
import LinesOfCodeTask from './tasks/lines-of-code-task.js';
import ValidEsmPackageTask from './tasks/valid-esm-package-task.js';
import { evaluateActions as evaluateESLintDisables } from './actions/eslint-disable-actions.js';
import { evaluateActions as evaluateESLintSummary } from './actions/eslint-summary-actions.js';
import { evaluateActions as evaluateOutdatedDependencies } from './actions/outdated-dependency-actions.js';

export function register(args: RegistrationArgs) {
  let pluginName = getPluginName(__dirname);

  args.register.actions('eslint-disables', evaluateESLintDisables);
  args.register.actions('eslint-summary', evaluateESLintSummary);
  args.register.actions('outdated-dependencies', evaluateOutdatedDependencies);

  args.register.task(new EslintSummaryTask(pluginName, args.context));
  args.register.task(new EslintDisableTask(pluginName, args.context));
  args.register.task(new OutdatedDependencyTask(pluginName, args.context));
  args.register.task(new LinesOfCodeTask(pluginName, args.context));
  args.register.task(new ValidEsmPackageTask(pluginName, args.context));
}
