import { FunctionComponent } from 'react';
import { Table } from './table';
import { List } from './list';
import { ListItem } from './list-item';

export function getComponents(): Map<string, FunctionComponent<{ data: any }>> {
  return new Map([
    ['table', Table],
    ['list', List],
    ['listItem', ListItem],
  ]);
}
