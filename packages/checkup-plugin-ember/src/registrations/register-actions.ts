import { RegisterActionsArgs } from '@checkup/core';
import { evaluateActions as evaluateTemplateLintDisables } from '../actions/ember-template-lint-disable-actions';
import { evaluateActions as evaluateTemplateLintSummary } from '../actions/ember-template-lint-summary-actions';
import { evaluateActions as evaluateTestTypes } from '../actions/ember-test-types-actions';

const register = async function ({ registerActions }: RegisterActionsArgs) {
  registerActions('ember-template-lint-disables', evaluateTemplateLintDisables);
  registerActions('ember-template-lint-summary', evaluateTemplateLintSummary);
  registerActions('ember-test-types', evaluateTestTypes);
};

export default register;
