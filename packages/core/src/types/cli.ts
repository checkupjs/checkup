export type RunArgs = {
  [name: string]: any;
};

export type RunFlags = {
  version: void;
  help: void;
  force: boolean;
  silent: boolean;
  reporter: string;
  reportOutputPath: string;
  task: string | undefined;
  config: string | undefined;
};
