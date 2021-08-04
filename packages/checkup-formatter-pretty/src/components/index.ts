import { default as InkTable } from 'ink-table';
import { Table } from './table';
import { List } from './list';
import { ListItem } from './list-item';

export function getComponents(): Record<string, any> {
  const componentsMap = {
    table: Table,
    list: List,
    inkTable: InkTable,
    listItem: ListItem,
  };

  return componentsMap;
}
