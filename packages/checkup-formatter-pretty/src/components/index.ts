import { default as InkTable } from 'ink-table';
import { Table } from './table';
import { List } from './list';
import { ListItem } from './list-item';

export function getComponents(): Record<string, any> {
  const componentsMap = new Map();

  componentsMap.set('table', Table);
  componentsMap.set('list', List);
  componentsMap.set('inkTable', InkTable);
  componentsMap.set('listItem', ListItem);

  return componentsMap;
}
