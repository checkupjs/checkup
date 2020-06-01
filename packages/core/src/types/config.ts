export type TaskConfig = 'on' | 'off' | ['on' | 'off', unknown];
export type CheckupConfig = {
  excludePaths: string[];
  plugins: string[];
  tasks: Record<string, TaskConfig>;
};
