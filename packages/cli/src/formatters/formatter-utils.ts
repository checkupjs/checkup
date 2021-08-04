import { Notification } from 'sarif';
import { CheckupMetadata, ConsoleWriter } from '@checkup/core';
import { yellow } from 'chalk';

export function renderActions(actions: Notification[], writer: ConsoleWriter): void {
  if (actions && actions.length > 0) {
    writer.categoryHeader('Actions');
    actions.forEach((action: Notification) => {
      writer.log(`${yellow('■')} ${action.message.text}`);
    });
    writer.blankLine();
  }
}

export function renderInfo(metadata: CheckupMetadata, writer: ConsoleWriter) {
  let { analyzedFilesCount, project } = metadata;
  let { name, version, repository } = project;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${writer.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  writer.blankLine();
  writer.log(
    `Checkup report generated for ${writer.emphasize(`${name} v${version}`)}${analyzedFilesMessage}`
  );
  writer.blankLine();
  writer.log(
    `This project is ${writer.emphasize(`${repository.age} old`)}, with ${writer.emphasize(
      `${repository.activeDays} active days`
    )}, ${writer.emphasize(`${repository.totalCommits} commits`)} and ${writer.emphasize(
      `${repository.totalFiles} files`
    )}.`
  );
  writer.blankLine();
}

export function renderLinesOfCode(info: CheckupMetadata, writer: ConsoleWriter) {
  let { repository } = info.project;

  writer.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  writer.blankLine();
}

export function renderCLIInfo(metadata: CheckupMetadata, writer: ConsoleWriter) {
  let { version, configHash } = metadata.cli;

  writer.dimmed(`checkup v${version}`);
  writer.dimmed(`config ${configHash}`);
  writer.blankLine();
}
