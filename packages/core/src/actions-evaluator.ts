import { TaskConfig, ActionConfig } from './types/config';
import { parseConfigTuple } from './config';
import { Action2 } from './types/tasks';

export default class ActionsEvaluator {
  private actions: Action2[] = [];

  add(action: Action2) {
    this.actions.push(action);
  }

  evaluate(config: TaskConfig): Action2[] {
    let actionConfig: ActionConfig = config.actions ?? {};

    return this.actions.filter((action: Action2) => {
      let [enabled, value] = parseConfigTuple<{ threshold: number }>(actionConfig[action.name]);
      let threshold =
        value && typeof value.threshold === 'number' ? value.threshold : action.defaultThreshold;

      return enabled && action.input >= threshold;
    });
  }
}
