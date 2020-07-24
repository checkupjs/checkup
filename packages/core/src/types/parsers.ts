import { CLIEngine, Linter } from 'eslint';

const TemplateLinter = require('ember-template-lint');

export type ParserName = string;
export type ParserOptions = Record<string, any>;
export type ParserReport = any;
export interface Parser<ParserReport> {
  execute(paths: string[]): Promise<ParserReport>;
}

export interface CreateParser<ParserOptions, TParser = Parser<ParserReport>> {
  (config: ParserOptions): TParser;
}

export type TemplateLinter = typeof TemplateLinter;

export type ESLintOptions = CLIEngine.Options;
export type ESLintReport = CLIEngine.LintReport;
export type ESLintResult = CLIEngine.LintResult;
export type ESLintMessage = Linter.LintMessage;
