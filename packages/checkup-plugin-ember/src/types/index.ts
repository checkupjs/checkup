export const enum ProjectType {
  App = 'application',
  Addon = 'addon',
  Engine = 'engine',
  Unknown = 'unknown',
}

export type DepFreshnessInfo = {
  tableHead: [string];
  tableBody: Array<String[]>;
};
