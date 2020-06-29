export type ConfigValue<T extends {}> = 'on' | 'off' | ['on' | 'off', T];
export type ActionConfig = Record<string, ConfigValue<{ threshold: number }>>;
export type TaskConfig = { actions?: ActionConfig; [key: string]: any };
export type CheckupConfig = {
  excludePaths: string[];
  plugins: string[];
  tasks: Record<string, ConfigValue<TaskConfig>>;
};
