import { TaskName, TaskResult, Action, ActionsEvaluationResult } from '../types/tasks';

const registeredActions = new Map<TaskName, (taskResult: TaskResult) => Action[]>();

export function getRegisteredActions() {
  return registeredActions;
}

export function registerActions(taskName: TaskName, evaluate: ActionsEvaluationResult) {
  registeredActions.set(taskName, evaluate);
}
