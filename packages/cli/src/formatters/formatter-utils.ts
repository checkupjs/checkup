import { Action, CheckupMetadata, FormatterArgs } from '@checkup/core';
import { yellow, bold } from 'chalk';

export function renderActions(actions: Action[], args: FormatterArgs): void {
  if (actions && actions.length > 0) {
    args.writer.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      args.writer.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    args.writer.blankLine();
  }
}

export function renderInfo(info: CheckupMetadata, args: FormatterArgs) {
  let { analyzedFilesCount, project } = info;
  let { name, version, repository } = project;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${args.writer.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  args.writer.blankLine();
  args.writer.log(
    `Checkup report generated for ${args.writer.emphasize(
      `${name} v${version}`
    )}${analyzedFilesMessage}`
  );
  args.writer.blankLine();
  args.writer.log(
    `This project is ${args.writer.emphasize(
      `${repository.age} old`
    )}, with ${args.writer.emphasize(
      `${repository.activeDays} active days`
    )}, ${args.writer.emphasize(`${repository.totalCommits} commits`)} and ${args.writer.emphasize(
      `${repository.totalFiles} files`
    )}.`
  );
  args.writer.blankLine();
}

export function renderLinesOfCode(info: CheckupMetadata, args: FormatterArgs) {
  let { repository } = info.project;

  args.writer.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  args.writer.blankLine();
}

export function renderCLIInfo(info: CheckupMetadata, args: FormatterArgs) {
  let { version: cliVersion, configHash } = info.cli;

  args.writer.dimmed(`checkup v${cliVersion}`);
  args.writer.dimmed(`config ${configHash}`);
  args.writer.blankLine();
}
