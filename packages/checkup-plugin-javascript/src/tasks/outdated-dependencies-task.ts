import { join } from 'path';
import { Result } from 'sarif';
import { BaseTask, Task, DependencyAnalyzer } from '@checkup/core';

export default class OutdatedDependenciesTask extends BaseTask implements Task {
  taskName = 'outdated-dependencies';
  taskDisplayName = 'Outdated Dependencies';
  description = 'Gets a summary of all outdated dependencies in a project';
  category = 'dependencies';

  async run(): Promise<Result[]> {
    let analyzer = new DependencyAnalyzer(this.context.options.cwd);
    let dependencies = await analyzer.analyze();

    return dependencies
      .filter((dependency) => {
        return ['major', 'minor', 'patch'].includes(dependency.semverBump);
      })
      .map((dependency) => {
        return {
          ruleId: this.taskName,
          message: {
            text: `Outdated ${dependency.semverBump} version of ${dependency.packageName}. Installed: ${dependency.installedVersion}. Latest: ${dependency.latestVersion}.`,
          },
          kind: 'review',
          level: getLevel(dependency.semverBump),
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: join(this.context.options.cwd, 'package.json'),
                },
                region: {
                  startLine: dependency.startLine,
                  startColumn: dependency.startColumn,
                },
              },
            },
          ],
          properties: {
            taskDisplayName: this.taskDisplayName,
            category: this.category,
            packageName: dependency.packageName,
            packageVersion: dependency.packageVersion,
            latestVersion: dependency.latestVersion,
            type: dependency.type,
          },
        };
      });
  }
}

function getLevel(semverBump: string): Result.level {
  switch (semverBump) {
    case 'major': {
      return 'error';
    }
    case 'minor': {
      return 'warning';
    }
    case 'patch': {
      return 'note';
    }
    default: {
      return 'none';
    }
  }
}
