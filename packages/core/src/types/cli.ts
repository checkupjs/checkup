export type RunFlags = {
  version: void;
  help: void;
  config: string | undefined;
  cwd: string;
  category: string[] | undefined;
  group: string[] | undefined;
  task: string[] | undefined;
  listTasks: boolean;
  format: string;
  outputFile: string;
  excludePaths: string[] | undefined;
};
