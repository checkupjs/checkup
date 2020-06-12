export type ActionConfig = { [key: string]: number | 'off' };
export type TaskConfig = { actions?: ActionConfig[]; [key: string]: any } | [];
export type CheckupConfig = {
  excludePaths: string[];
  plugins: string[];
  tasks: Record<string, 'on' | 'off' | ['on' | 'off', TaskConfig]>;
};
