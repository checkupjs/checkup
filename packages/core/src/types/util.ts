import { TaskItemData } from './tasks';

export interface ResultData {
  results: TaskItemData[];
  errors: string[];
}

export interface SearchPattern {
  patternName: string;
  patterns: string[];
}

export interface SearchItem {
  patternName: string;
  fileName: string;
}
