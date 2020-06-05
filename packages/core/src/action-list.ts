import { ActionConfig } from './types/config';
import { Action } from './types/tasks';

/**
 * @class ActionList
 *
 * Represents a collection of actions related to a task
 */
export default class ActionList {
  _availableActions: Action[];
  _config: ActionConfig[];

  constructor(availableActions: Action[], config: ActionConfig[]) {
    this._availableActions = availableActions;
    this._config = config;
  }

  getAvailableAction(key: string): Action | undefined {
    return this._availableActions.filter((availableAction) => availableAction.key === key).pop();
  }

  getEnabledAction(key: string): Action | undefined {
    return this.enabledActions.filter((enabledAction) => enabledAction.key === key).pop();
  }

  isActionEnabled(key: string): Boolean {
    return this.enabledActions.some((enabledAction) => {
      return enabledAction.key === key;
    });
  }

  isActionAvailable(key: string): Boolean {
    return this._availableActions.some((availableAction) => {
      return availableAction.key === key;
    });
  }

  get actionMessages() {
    let actionMessages: string[] = [];
    this.enabledActions.forEach((action) => {
      if (action.isEnabled()) {
        actionMessages.push(action.message());
      }
    });

    return actionMessages;
  }

  get isActionable() {
    if (this.actionMessages.length > 0) {
      return true;
    }

    return false;
  }

  get enabledActions() {
    return this._availableActions
      .map((action: Action) => {
        let configForAction = this.findConfigForAction(action);

        if (configForAction) {
          let configuredAction = this.applyConfigForAction(action, configForAction);
          return configuredAction?.isEnabled() ? configuredAction : undefined;
        }

        if (action.enabledByDefault && action.isEnabled()) {
          return action;
        }
      })
      .filter(Boolean) as Action[];
  }

  private findConfigForAction(action: Action): ActionConfig | undefined {
    return this._config.find((conf) => {
      if (typeof conf === 'string' && conf === action.key) {
        return conf;
      }
      return Object.keys(conf)[0] === action.key;
    });
  }

  private applyConfigForAction(action: Action, actionConfig: ActionConfig): Action | undefined {
    if (typeof actionConfig === 'string') {
      return action;
    }

    if (typeof actionConfig === 'object') {
      let configValue = Object.values(actionConfig)[0];

      if (typeof configValue === 'number') {
        action.threshold = configValue;
        return action;
      }

      return configValue === 'on' ? action : undefined;
    }
  }
}
