import { RegistrationArgs, getPluginName } from '@checkup/core';

import EslintDisableTask from './tasks/eslint-disable-task';
import EslintSummaryTask from './tasks/eslint-summary-task';
import OutdatedDependencyTask from './tasks/outdated-dependencies-task';
import LinesOfCodeTask from './tasks/lines-of-code-task';
import { evaluateActions as evaluateESLintDisables } from './actions/eslint-disable-actions';
import { evaluateActions as evaluateESLintSummary } from './actions/eslint-summary-actions';
import { evaluateActions as evaluateOutdatedDependencies } from './actions/outdated-dependency-actions';

export function register(args: RegistrationArgs) {
  let pluginName = getPluginName(__dirname);

  args.register.actions('eslint-disables', evaluateESLintDisables);
  args.register.actions('eslint-summary', evaluateESLintSummary);
  args.register.actions('outdated-dependencies', evaluateOutdatedDependencies);

  args.register.task(new EslintSummaryTask(pluginName, args.context));
  args.register.task(new EslintDisableTask(pluginName, args.context));
  args.register.task(new OutdatedDependencyTask(pluginName, args.context));
  args.register.task(new LinesOfCodeTask(pluginName, args.context));
}
