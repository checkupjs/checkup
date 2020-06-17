export type ActionConfigValue = { threshold: number } | 'off' | ['off', { threshold: number }];
export type ActionConfig = Record<string, ActionConfigValue>;
export type TaskConfig = { actions?: ActionConfig; [key: string]: any };
export type CheckupConfig = {
  excludePaths: string[];
  plugins: string[];
  tasks: Record<string, 'off' | ['off', TaskConfig] | TaskConfig>;
};
