import { TaskConfig, ActionConfig } from '../types/config';
import { parseConfigTuple } from '../config';
import { TaskAction } from '../types/tasks';

export default class TaskActionsEvaluator {
  private actions: TaskAction[] = [];

  add(action: TaskAction) {
    this.actions.push(action);
  }

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
