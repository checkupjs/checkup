import { ESLint, Linter } from 'eslint';
import { TemplateLintMessage, TemplateLintResult } from './ember-template-lint.js';

const EmberTemplateLinter = require('ember-template-lint').TemplateLinter;

export type AnalyzerReport = any;
export interface LintAnalyzer<ParserReport> {
  analyze(paths: string[]): Promise<ParserReport>;
}

export type LintMessage = ESLintMessage | TemplateLintMessage;
export type LintResult = ESLint.LintResult | TemplateLintResult;

export type TemplateLinter = typeof EmberTemplateLinter;

export type ESLintOptions = ESLint.Options;
export type ESLintMessage = Linter.LintMessage;
