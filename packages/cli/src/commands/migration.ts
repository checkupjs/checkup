import { OutputFormat } from '@checkup/core';
import { flags } from '@oclif/command';
import { BaseTaskCommand } from '../base-task-command';
import { pathArg } from '../args';
import {
  excludePaths,
  config,
  cwd,
  category,
  group,
  task,
  format,
  outputFile,
  listTasks,
} from '../flags';
export default class MigrationCommand extends BaseTaskCommand {
  static description = 'Runs migration-based tasks';
  static strict = false;
  static usage = 'migration PATHS [OPTIONS]';
  static args = [pathArg];
  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'exclude-paths': excludePaths,
    config,
    cwd,
    category,
    group,
    task,
    format,
    'output-file': outputFile,
    'list-tasks': listTasks,
    verbose: flags.boolean({
      exclusive: ['format', 'output-file'],
    }),
  };

  public async init() {
    let { argv, flags } = this.parse(MigrationCommand);

    if (flags['output-file'] && flags.format !== OutputFormat.json) {
      this.error(
        new Error(
          'Missing --format flag. --format=json must also be provided when using --output-file'
        )
      );
    }
    this.startTime = new Date().toJSON();
    this.runArgs = argv;
    this.runFlags = flags;
    this.cliModeEnabled = process.env.CHECKUP_CLI === '1';
  }

  protected async registerTasks() {
    await this.config.runHook('register-migration-tasks', {
      context: this.taskContext,
      tasks: this.pluginTasks,
    });
  }
}
