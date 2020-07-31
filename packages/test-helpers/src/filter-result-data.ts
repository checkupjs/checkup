import { SummaryResult, TaskItemData } from '@checkup/core';
const stringify = require('json-stable-stringify');

// the paths in the json result are dynamic, removing them for checking against the snapshot
export function clearFilePaths(types: SummaryResult[]) {
  return types.map((type: SummaryResult) => {
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

export function stableJson(json: object) {
  return stringify(json, { space: 2 });
}
