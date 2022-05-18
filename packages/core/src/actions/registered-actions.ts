import { TaskName, TaskActionsEvaluator } from '../types/tasks.js';

const registeredActions = new Map<TaskName, TaskActionsEvaluator>();

export function getRegisteredActions() {
  return registeredActions;
}

export function registerActions(taskName: TaskName, evaluate: TaskActionsEvaluator) {
  registeredActions.set(taskName, evaluate);
}
