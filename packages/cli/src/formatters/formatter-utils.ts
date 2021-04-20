import { Action, CheckupMetadata, FormatArgs } from '@checkup/core';
import { yellow, bold } from 'chalk';

export function renderActions(actions: Action[], formatArgs: FormatArgs): void {
  if (actions && actions.length > 0) {
    formatArgs.writer.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      formatArgs.writer.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    formatArgs.writer.blankLine();
  }
}

export function renderInfo(info: CheckupMetadata, formatArgs: FormatArgs) {
  let { analyzedFilesCount } = info;
  let { name, version, repository } = info.project;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${formatArgs.writer.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  formatArgs.writer.blankLine();
  formatArgs.writer.log(
    `Checkup report generated for ${formatArgs.writer.emphasize(
      `${name} v${version}`
    )}${analyzedFilesMessage}`
  );
  formatArgs.writer.blankLine();
  formatArgs.writer.log(
    `This project is ${formatArgs.writer.emphasize(
      `${repository.age} old`
    )}, with ${formatArgs.writer.emphasize(
      `${repository.activeDays} active days`
    )}, ${formatArgs.writer.emphasize(
      `${repository.totalCommits} commits`
    )} and ${formatArgs.writer.emphasize(`${repository.totalFiles} files`)}.`
  );
  formatArgs.writer.blankLine();
}

export function renderLinesOfCode(info: CheckupMetadata, formatArgs: FormatArgs) {
  let { repository } = info.project;

  formatArgs.writer.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  formatArgs.writer.blankLine();
}

export function renderCLIInfo(info: CheckupMetadata, formatArgs: FormatArgs) {
  let { version: cliVersion, configHash } = info.cli;

  formatArgs.writer.dimmed(`checkup v${cliVersion}`);
  formatArgs.writer.dimmed(`config ${configHash}`);
  formatArgs.writer.blankLine();
}
