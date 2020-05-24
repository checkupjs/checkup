export type TaskConfig = 'on' | 'off' | ['on' | 'off', unknown];
export type CheckupConfig = {
  plugins: string[];
  tasks: Record<string, TaskConfig>;
};
