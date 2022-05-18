import { ESLint, Linter } from 'eslint';
import EmberTemplateLinter from 'ember-template-lint';
import { TemplateLintMessage, TemplateLintResult } from './ember-template-lint.js';

export type AnalyzerReport = any;
export interface LintAnalyzer<ParserReport> {
  analyze(paths: string[]): Promise<ParserReport>;
}

export type LintMessage = ESLintMessage | TemplateLintMessage;
export type LintResult = ESLint.LintResult | TemplateLintResult;

export type TemplateLinter = typeof EmberTemplateLinter;

export type ESLintOptions = ESLint.Options;
export type ESLintMessage = Linter.LintMessage;
