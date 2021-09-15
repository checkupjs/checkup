import { TaskConfig, ActionConfig } from '../types/config';
import { parseConfigTuple } from '../config';
import { TaskAction } from '../types/tasks';

/**
 * Class for task actions evaluators
 */
export default class TaskActionsEvaluator {
  private actions: TaskAction[] = [];

  /**
   * Add task actions
   * @param  {TaskAction} action
   */
  add(action: TaskAction) {
    this.actions.push(action);
  }

  /**
   * Evaluate which actions are qulified.
   * @param  {TaskConfig} config
   * @param  {string} config.$schema
   * @param  {string[]} config.excludePaths
   * @param  {string[]} config.plugins
   * @param  {Record<string, ConfigValue<TaskConfig>>} config.tasks
   *
   * @returns TaskAction[] - Enabled and qualified task actions
   */
  evaluate(config: TaskConfig): TaskAction[] {
    let actionConfig: ActionConfig = config.actions ?? {};

    return this.actions.filter((action: TaskAction) => {
      let [enabled, value] = parseConfigTuple<{ threshold: number }>(actionConfig[action.name]);
      let threshold =
        value && typeof value.threshold === 'number' ? value.threshold : action.defaultThreshold;

      return enabled && action.input >= threshold;
    });
  }
}
