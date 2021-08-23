export interface BarData {
  name: string;
  value: number;
  total: number;
}

export interface Options {
  cwd: string;
  format: string;
  outputFile?: string;
}
