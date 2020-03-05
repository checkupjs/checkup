import { CLIEngine } from 'eslint';
import { TaskResult, ui } from '@checkup/core';

// classic-decorator-hooks                  -
// classic-decorator-no-classic-methods     -
// no-actions-hash                          -
// no-classic-classes                       -
// no-classic-components                    -
// no-component-lifecycle-hooks             -
// no-computed-properties-in-native-classes -
// no-get-with-default                      -
// no-get                                   -
// no-jquery                                -
// require-tagless-components               -

interface MigrationInfo {
  name: string;
  violations: number;
}

interface MigrationRuleConfig {
  fileMatchers: RegExp[];
  name: string;
  rules: string[];
}

enum MigrationType {
  NativeClass,
}

const MIGRATION_RULE_CONFIGS: { [Key in MigrationType]: MigrationRuleConfig } = {
  [MigrationType.NativeClass]: {
    fileMatchers: [
      /app\/app\.js$/,
      /(app|addon)\/(adapters|components|controllers|helpers|models|routes|services)\/.*\.js$/,
    ],
    name: 'Native Class Migration',
    rules: [
      'ember/no-classic-classes',
      // 'ember/classic-decorator-no-classic-methods',
      // 'ember/no-actions-hash',
    ],
  },
};

const getMigrationInfo = (
  migrationConfig: MigrationRuleConfig,
  report: CLIEngine.LintReport
): MigrationInfo => {
  let relatedResults = report.results.filter(result => {
    let { filePath } = result;
    return migrationConfig.fileMatchers.some(fileMatcher => fileMatcher.test(filePath));
  });

  let totalMigrationViolations = relatedResults
    .map(result => result.errorCount)
    .reduce((totalErrors, resultErrorCount) => totalErrors + resultErrorCount);

  return {
    name: migrationConfig.name,
    violations: totalMigrationViolations,
  };
};

export default class OctaneMigrationStatusTaskResult implements TaskResult {
  taskName: string = 'Octane Migration Status';

  constructor(public report: CLIEngine.LintReport) {}

  toConsole() {
    ui.styledHeader(this.taskName);
    ui.blankLine();
    ui.styledObject({
      'JS Error Count': this.report.errorCount,
    });
    ui.blankLine();
  }

  toJson() {
    let nativeClassMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.NativeClass],
      this.report
    );

    return {
      totalViolations: this.report.errorCount,
      migrationTasks: [nativeClassMigrationInfo],
    };
  }
}
