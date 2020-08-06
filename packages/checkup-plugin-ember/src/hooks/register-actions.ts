import { Hook } from '@oclif/config';
import { RegisterActionsArgs } from '@checkup/core';
import { evaluateActions as evaluateTemplateLint } from '../actions/ember-template-lint-disable-actions';
import { evaluateActions as evaluateTestTypes } from '../actions/ember-test-types-actions';

const hook: Hook<RegisterActionsArgs> = async function ({ registerActions }: RegisterActionsArgs) {
  registerActions('ember-template-lint-disables', evaluateTemplateLint);
  registerActions('ember-test-types', evaluateTestTypes);
};

export default hook;
