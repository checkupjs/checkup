import { ActionConfig, TaskConfig } from './types/config';
import { Action } from './types/tasks';

/**
 * @class ActionList
 *
 * Represents a collection of actions related to a task
 */
export default class ActionList {
  _availableActions: Action[];
  _actionConfig: ActionConfig[] | [];

  constructor(availableActions: Action[], config: TaskConfig | undefined) {
    this._availableActions = availableActions;
    if (Array.isArray(config)) {
      this._actionConfig = [];
    } else {
      this._actionConfig = config?.actions || [];
    }
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
    return this._availableActions
      .map((action: Action) => {
        let configForAction = this.findConfigForAction(action);

        if (configForAction) {
          let configuredAction = this.applyConfigForAction(action, configForAction);
          return configuredAction?.enabled ? configuredAction : undefined;
        }

        if (action.enabled) {
          return action;
        }
      })
      .filter(Boolean) as Action[];
  }

  private findConfigForAction(action: Action): ActionConfig | undefined {
    return this._actionConfig?.find((conf) => Object.keys(conf)[0] === action.name);
  }

  private applyConfigForAction(action: Action, actionConfig: ActionConfig): Action | undefined {
    let configValue = Object.values(actionConfig)[0];

    if (typeof configValue === 'number') {
      action.threshold = configValue;
      return action;
    }

    if (configValue === 'off') {
      return;
    }
  }
}
