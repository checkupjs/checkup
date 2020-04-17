import { Category, Priority, TaskClassification } from '../types/tasks';

import BaseTaskResult from '../base-task-result';

const CATEGORY_SORT_MAP = {
  [Category.Insights]: 3,
  [Category.Migrations]: 2,
  [Category.Recommendations]: 1,
};

const PRIORITY_SORT_MAP = {
  [Priority.High]: 3,
  [Priority.Medium]: 2,
  [Priority.Low]: 1,
};

export function taskComparator<T extends BaseTaskResult>(first: T, second: T) {
  let { category: firstC, priority: firstP }: TaskClassification = first.meta.taskClassification;
  let { category: secondC, priority: secondP }: TaskClassification = second.meta.taskClassification;

  let firstCategory = CATEGORY_SORT_MAP[firstC];
  let firstPriority = PRIORITY_SORT_MAP[firstP];
  let secondCategory = CATEGORY_SORT_MAP[secondC];
  let secondPriority = PRIORITY_SORT_MAP[secondP];

  if (firstCategory === secondCategory) {
    // eslint-disable-next-line unicorn/no-nested-ternary
    return firstPriority > secondPriority ? -1 : firstPriority < secondPriority ? 1 : 0;
  } else {
    return firstCategory > secondCategory ? -1 : 1;
  }
}
