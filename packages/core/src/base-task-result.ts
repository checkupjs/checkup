import { Category, TaskMetaData } from './types';

const CATEGORY_SORT_MAP = {
  [Category.Meta]: 4,
  [Category.Insights]: 3,
  [Category.Migrations]: 2,
  [Category.Recommendations]: 1,
};

export default abstract class BaseTaskResult {
  meta: TaskMetaData;

  constructor(meta: TaskMetaData) {
    this.meta = meta;
  }

  compareTo(other: BaseTaskResult) {
    let { category } = other.meta.taskClassification;
    let thisCategory = CATEGORY_SORT_MAP[this.meta.taskClassification.category];
    let otherCategory = CATEGORY_SORT_MAP[category];

    if (thisCategory > otherCategory) {
      return 1;
    } else if (thisCategory < otherCategory) {
      return -1;
    }
    return 0;
  }
}
