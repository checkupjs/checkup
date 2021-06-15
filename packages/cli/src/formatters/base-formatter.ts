import { BaseOutputWriter, FormatterArgs } from '@checkup/core';
import { Notification } from 'sarif';
import { yellow } from 'chalk';

export default abstract class BaseFormatter<T extends BaseOutputWriter> {
  writer!: T;

  constructor(public args: FormatterArgs) {}

  renderMetadata() {
    let { analyzedFilesCount, project } = this.args.logParser.metaData;
    let { name, version, repository } = project;

    let analyzedFilesMessage =
      repository.totalFiles !== analyzedFilesCount
        ? ` (${this.writer.emphasize(`${analyzedFilesCount} files`)} analyzed)`
        : '';

    this.writer.blankLine();
    this.writer.log(
      `Checkup report generated for ${this.writer.emphasize(
        `${name} v${version}`
      )}${analyzedFilesMessage}`
    );
    this.writer.blankLine();
    this.writer.log(
      `This project is ${this.writer.emphasize(
        `${repository.age} old`
      )}, with ${this.writer.emphasize(
        `${repository.activeDays} active days`
      )}, ${this.writer.emphasize(
        `${repository.totalCommits} commits`
      )} and ${this.writer.emphasize(`${repository.totalFiles} files`)}.`
    );
    this.writer.blankLine();
  }

  renderActions(): void {
    let actions = this.args.logParser.actions;

    if (actions && actions.length > 0) {
      this.writer.categoryHeader('Actions');
      actions.forEach((action: Notification) => {
        this.writer.log(`${yellow('■')} ${action.message.text}`);
      });
      this.writer.blankLine();
    }
  }

  renderCLIInfo() {
    let { version, configHash } = this.args.logParser.metaData.cli;

    this.writer.dimmed(`checkup v${version}`);
    this.writer.dimmed(`config ${configHash}`);
    this.writer.blankLine();
  }
}
