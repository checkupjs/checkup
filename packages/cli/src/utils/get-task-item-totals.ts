import { ITaskItemData, IDictionary } from '../types';

export default function getTaskItemTotals(data: ITaskItemData): IDictionary<number> {
  return Object.keys(data).reduce((total: IDictionary<number>, type: string) => {
    total[type] = data[type].length;

    return total;
  }, {});
}
