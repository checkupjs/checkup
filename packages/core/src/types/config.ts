export type TaskConfig = 'on' | 'off' | ['on' | 'off', unknown];
export type CheckupConfig = {
  pathsToIgnore: string[];
  plugins: string[];
  tasks: Record<string, TaskConfig>;
};
