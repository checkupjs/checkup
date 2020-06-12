import { Action } from '@checkup/core';

export function isActionEnabled(enabledActions: Action[], actionName: string) {
  return enabledActions.some((enabledAction) => enabledAction.name === actionName);
}
