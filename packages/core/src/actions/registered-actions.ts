import { TaskName, TaskActionsEvaluator } from '../types/tasks';

const registeredActions = new Map<TaskName, TaskActionsEvaluator>();

/**
 * Get evaluter evaluators of registered tasks.
 *
 * @return registeredActions - A registered actions Map<TaskName, TaskActionsEvaluator>
 */
export function getRegisteredActions() {
  return registeredActions;
}

/**
 * Register evaluators for tasks.
 * @param  {TaskName} taskName
 * @param  {TaskActionsEvaluator} evaluate
 */
export function registerActions(taskName: TaskName, evaluate: TaskActionsEvaluator) {
  registeredActions.set(taskName, evaluate);
}
