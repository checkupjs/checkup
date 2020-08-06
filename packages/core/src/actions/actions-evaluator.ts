import { TaskConfig, ActionConfig } from '../types/config';
import { parseConfigTuple } from '../config';
import { Action } from '../types/tasks';

export default class ActionsEvaluator {
  private actions: Action[] = [];

  add(action: Action) {
    this.actions.push(action);
  }

  evaluate(config: TaskConfig): Action[] {
    let actionConfig: ActionConfig = config.actions ?? {};

    return this.actions.filter((action: Action) => {
      let [enabled, value] = parseConfigTuple<{ threshold: number }>(actionConfig[action.name]);
      let threshold =
        value && typeof value.threshold === 'number' ? value.threshold : action.defaultThreshold;

      return enabled && action.input >= threshold;
    });
  }
}
