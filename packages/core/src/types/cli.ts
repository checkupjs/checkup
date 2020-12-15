export type RunFlags = {
  version: void;
  help: void;
  config: string | undefined;
  cwd: string;
  category: string[] | undefined;
  group: string[] | undefined;
  task: string[] | undefined;
  'list-tasks': boolean;
  format: string;
  'output-file': string;
  'exclude-paths': string[] | undefined;
  verbose: boolean;
};
