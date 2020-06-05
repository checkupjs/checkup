export type ActionConfig = string | { [key: string]: number } | { [key: string]: 'on' | 'off' };
export type TaskConfig = 'on' | 'off' | ['on', ActionConfig[]];
export type CheckupConfig = {
  excludePaths: string[];
  plugins: string[];
  tasks: Record<string, TaskConfig>;
};
