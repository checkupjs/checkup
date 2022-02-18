import * as deepmerge from 'deepmerge';
import { Linter } from 'eslint';
import { TemplateLintConfig } from '../types/ember-template-lint';

/**
 * Merges a task-specific lint configuration into the Task's lint configuration.
 *
 * @param {(TemplateLintConfig | CLIEngine.Options)} config - The linting configuration to merge into.
 * @param {Record<string, any>} taskLintConfig - The task's specific lint configuration.
 * @returns {*} - The combined configs
 */
export function mergeLintConfig(
  config: TemplateLintConfig | Linter.Config,
  taskLintConfig: Record<string, any>
) {
  let combinedConfigs = deepmerge(config, taskLintConfig);

  if (combinedConfigs.rules) {
    let rules = combinedConfigs.rules;
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

  return combinedConfigs;
}
