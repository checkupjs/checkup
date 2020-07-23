import { SummaryData, TaskItemData } from '@checkup/core';

// the paths in the json result are dynamic, removing them for checking against the snapshot
export function clearFilePaths(types: SummaryData[]) {
  return types.map((type: SummaryData) => {
    type.data = [type.count.toString()];
    return type;
  });
}

export function clearFilePathsTmp(types: TaskItemData[]) {
  return types.map((type: TaskItemData) => {
    type.data = [type.data.length as string];
    return type;
  });
}
