import { TaskItemData } from '@checkup/core';

// the paths in the json result are dynamic, removing them for checking against the snapshot
export function clearFilePaths(types: TaskItemData[]) {
  return types.map((type: TaskItemData) => {
    type.data = [];
    return type;
  });
}
