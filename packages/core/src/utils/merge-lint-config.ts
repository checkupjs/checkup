import * as deepmerge from 'deepmerge';
import { CLIEngine } from 'eslint';
import { TemplateLintConfig } from '../types/ember-template-lint';

export function mergeLintConfig(
  config: TemplateLintConfig | CLIEngine.Options,
  taskLintConfig: { [key: string]: any }
) {
  let initialMerge = deepmerge(config, taskLintConfig);

  if (initialMerge.rules) {
    let rules = initialMerge.rules;
    let ruleIds = Object.keys(rules);

    ruleIds.forEach((ruleId: string) => {
      let ruleConfig = rules[ruleId];
      let firstTuplePart = '';
      let secondTuplePart = {};

      if (Array.isArray(ruleConfig) && ruleConfig.length > 2) {
        for (const [i, element] of ruleConfig.entries()) {
          if (i % 2 === 0) {
            firstTuplePart = element;
          } else {
            secondTuplePart = Object.assign(secondTuplePart, element);
          }
        }

        rules[ruleId] = [firstTuplePart, secondTuplePart];
      }
    });
  }

  return initialMerge;
}
