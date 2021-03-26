import { Action, CheckupMetadata, ui } from '@checkup/core';
import { yellow, bold } from 'chalk';

export function renderActions(actions: Action[]): void {
  if (actions && actions.length > 0) {
    ui.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      ui.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    ui.blankLine();
  }
}

export function renderInfo(info: CheckupMetadata) {
  let { analyzedFilesCount } = info;
  let { name, version, repository } = info.project;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${ui.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  ui.blankLine();
  ui.log(
    `Checkup report generated for ${ui.emphasize(`${name} v${version}`)}${analyzedFilesMessage}`
  );
  ui.blankLine();
  ui.log(
    `This project is ${ui.emphasize(`${repository.age} old`)}, with ${ui.emphasize(
      `${repository.activeDays} active days`
    )}, ${ui.emphasize(`${repository.totalCommits} commits`)} and ${ui.emphasize(
      `${repository.totalFiles} files`
    )}.`
  );
  ui.blankLine();
}

export function renderLinesOfCode(info: CheckupMetadata) {
  let { repository } = info.project;

  ui.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  ui.blankLine();
}

export function renderCLIInfo(info: CheckupMetadata) {
  let { version: cliVersion, configHash } = info.cli;

  ui.dimmed(`checkup v${cliVersion}`);
  ui.dimmed(`config ${configHash}`);
  ui.blankLine();
}
