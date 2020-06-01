export type RunFlags = {
  version: void;
  help: void;
  config: string | undefined;
  cwd: string;
  task: string | undefined;
  format: string;
  outputFile: string;
  excludePaths: string[] | undefined;
};
