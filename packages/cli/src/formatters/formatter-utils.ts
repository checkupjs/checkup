import { Action, CheckupMetadata, ConsoleWriter } from '@checkup/core';
import { yellow, bold } from 'chalk';

let consoleWriter = new ConsoleWriter();

export function renderActions(actions: Action[]): void {
  if (actions && actions.length > 0) {
    consoleWriter.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      consoleWriter.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    consoleWriter.blankLine();
  }
}

export function renderInfo(info: CheckupMetadata) {
  let { analyzedFilesCount } = info;
  let { name, version, repository } = info.project;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${consoleWriter.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  consoleWriter.blankLine();
  consoleWriter.log(
    `Checkup report generated for ${consoleWriter.emphasize(
      `${name} v${version}`
    )}${analyzedFilesMessage}`
  );
  consoleWriter.blankLine();
  consoleWriter.log(
    `This project is ${consoleWriter.emphasize(
      `${repository.age} old`
    )}, with ${consoleWriter.emphasize(
      `${repository.activeDays} active days`
    )}, ${consoleWriter.emphasize(
      `${repository.totalCommits} commits`
    )} and ${consoleWriter.emphasize(`${repository.totalFiles} files`)}.`
  );
  consoleWriter.blankLine();
}

export function renderLinesOfCode(info: CheckupMetadata) {
  let { repository } = info.project;

  consoleWriter.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  consoleWriter.blankLine();
}

export function renderCLIInfo(info: CheckupMetadata) {
  let { version: cliVersion, configHash } = info.cli;

  consoleWriter.dimmed(`checkup v${cliVersion}`);
  consoleWriter.dimmed(`config ${configHash}`);
  consoleWriter.blankLine();
}
