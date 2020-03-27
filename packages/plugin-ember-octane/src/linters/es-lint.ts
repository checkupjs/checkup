import { CLIEngine } from 'eslint';

export function getESLintEngine(esLintConfig: CLIEngine.Options): CLIEngine {
  return new CLIEngine(esLintConfig);
}
