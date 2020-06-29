import { ActionConfig, TaskConfig, ConfigValue } from './types/config';
import { Action } from './types/tasks';
import { getConfigTuple } from './config';

/**
 * @class ActionList
 *
 * Represents a collection of actions related to a task
 */
export default class ActionList {
  _defaultActions: Action[];
  _actionConfig: ActionConfig;

  constructor(defaultActions: Action[], config: TaskConfig | undefined) {
    this._defaultActions = defaultActions;
    this._actionConfig = config?.actions || {};
  }

  get actionMessages() {
    let actionMessages: string[] = [];
    this.enabledActions.forEach((action) => {
      if (action.enabled) {
        actionMessages.push(action.message);
      }
    });

    return actionMessages;
  }

  get isActionable() {
    return this.actionMessages.length > 0;
  }

  get enabledActions() {
    return this._defaultActions
      .map((action: Action) => {
        if (this._actionConfig[action.name]) {
          let [enabled, configuredAction] = this._applyConfigForAction(
            action,
            this._actionConfig[action.name]
          );
          return enabled ? configuredAction : undefined;
        }

        if (action.enabled) {
          return action;
        }
      })
      .filter(Boolean) as Action[];
  }

  private _applyConfigForAction(
    action: Action,
    actionConfig: ConfigValue<{ threshold: number }>
  ): [boolean, Action] {
    let [enabled, value] = getConfigTuple<{ threshold: number }>(actionConfig);

    if (typeof value.threshold === 'number') {
      action.threshold = value.threshold;
    }

    return [enabled, action];
  }
}
