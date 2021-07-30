import { Log } from 'sarif';

export enum OutputFormat {
  summary = 'summary',
  json = 'json',
  pretty = 'pretty',
}

export interface FormatterOptions {
  cwd: string;
  format: OutputFormat;
  outputFile?: string;
  log: Log;
}
