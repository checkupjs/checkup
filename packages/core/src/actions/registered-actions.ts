import { TaskName, Action, ActionsEvaluationResult } from '../types/tasks';
import { TaskResult } from '../types/checkup-result';
import { TaskConfig } from '../types/config';

const registeredActions = new Map<
  TaskName,
  (taskResult: TaskResult, taskConfig: TaskConfig) => Action[]
>();

export function getRegisteredActions() {
  return registeredActions;
}

export function registerActions(taskName: TaskName, evaluate: ActionsEvaluationResult) {
  registeredActions.set(taskName, evaluate);
}
