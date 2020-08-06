export type RunFlags = {
  version: void;
  help: void;
  config: string | undefined;
  cwd: string;
  tasks: string[] | undefined;
  listTasks: boolean;
  format: string;
  outputFile: string;
  excludePaths: string[] | undefined;
};
