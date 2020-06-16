import { ActionConfig, TaskConfig, ActionConfigValue } from './types/config';
import { Action } from './types/tasks';

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
          let configuredAction = this._applyConfigForAction(
            action,
            this._actionConfig[action.name]
          );
          return configuredAction?.enabled ? configuredAction : undefined;
        }

        if (action.enabled) {
          return action;
        }
      })
      .filter(Boolean) as Action[];
  }

  private _applyConfigForAction(
    action: Action,
    actionConfig: ActionConfigValue
  ): Action | undefined {
    if (actionConfig === 'off') {
      return;
    } else if (Array.isArray(actionConfig)) {
      let [enabled] = actionConfig;
      if (enabled === 'off') {
        return;
      }
    } else {
      action.threshold = actionConfig.threshold;
      return action;
    }
  }
}
