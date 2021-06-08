import { CLIEngine, Linter } from 'eslint';
import { TemplateLintMessage, TemplateLintResult } from './ember-template-lint';

const EmberTemplateLinter = require('ember-template-lint').TemplateLinter;

export type AnalyzerReport = any;
export interface LintAnalyzer<ParserReport> {
  analyze(paths: string[]): Promise<ParserReport>;
}

export type LintMessage = ESLintMessage | TemplateLintMessage;
export type LintResult = ESLintResult | TemplateLintResult;

export type TemplateLinter = typeof EmberTemplateLinter;

export type ESLintOptions = CLIEngine.Options;
export type ESLintReport = CLIEngine.LintReport;
export type ESLintResult = CLIEngine.LintResult;
export type ESLintMessage = Linter.LintMessage;
