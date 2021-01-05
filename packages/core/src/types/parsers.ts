import { CLIEngine, Linter } from 'eslint';
import { TaskConfig } from './config';

const EmberTemplateLinter = require('ember-template-lint').TemplateLinter;

export type ParserName = string;
export type ParserOptions = Record<string, any>;
export type ParserReport = any;
export interface Parser<ParserReport> {
  execute(paths: string[]): Promise<ParserReport>;
}

export interface CreateParser<ParserOptions, TParser = Parser<ParserReport>> {
  (config: ParserOptions, taskConfig?: TaskConfig): TParser;
}

export type TemplateLinter = typeof EmberTemplateLinter;

export type ESLintOptions = CLIEngine.Options;
export type ESLintReport = CLIEngine.LintReport;
export type ESLintResult = CLIEngine.LintResult;
export type ESLintMessage = Linter.LintMessage;
