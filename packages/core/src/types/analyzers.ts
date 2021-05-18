import { CLIEngine, Linter } from 'eslint';

const EmberTemplateLinter = require('ember-template-lint').TemplateLinter;

export type AnalyzerReport = any;
export interface LintAnalyzer<ParserReport> {
  analyze(paths: string[]): Promise<ParserReport>;
}

export type TemplateLinter = typeof EmberTemplateLinter;

export type ESLintOptions = CLIEngine.Options;
export type ESLintReport = CLIEngine.LintReport;
export type ESLintResult = CLIEngine.LintResult;
export type ESLintMessage = Linter.LintMessage;
