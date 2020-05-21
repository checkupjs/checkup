import { TaskItemData } from '@checkup/core';

// the paths in the json result are dynamic, removing them for checking against the snapshot
export function filterTaskItemDataJson(types: TaskItemData[]) {
  return types.map((type: TaskItemData) => {
    type.data = [];
    return type;
  });
}
