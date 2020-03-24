import { CLIEngine } from 'eslint';

export enum ESLintMigrationType {
  NativeClasses = 'native-classes',
  TaglessComponents = 'tagless-components',
  GlimmerComponents = 'glimmer-components',
  TrackedProperties = 'tracked-properties',
}

export enum TemplateLintMigrationType {
  AngleBrackets = 'angle-brackets',
  NamedArgs = 'named-args',
  OwnProperties = 'own-properties',
  UseModifiers = 'use-modifiers',
}

type LintResultCollection = CLIEngine.LintResult[] | EmberTemplateLintResult[];

interface EmberTemplateLintResultMessage {
  rule: string;
  severity: number;
  moduleId: string;
  message: string;
  line: number;
  column: number;
  source: string;
}

interface CompetionInfo {
  total: number;
  completed: number;
  percentage: string;
}

export interface EmberTemplateLintResult {
  filePath: string;
  messages: EmberTemplateLintResultMessage[];
  errorCount: number;
}

export interface EmberTemplateLintReport {
  errorCount: number;
  results: EmberTemplateLintResult[];
}

export interface MigrationInfo {
  completionInfo: CompetionInfo;
  name: string;
  relatedResults: LintResultCollection;
}

export interface MigrationRuleConfig {
  fileMatchers: RegExp[];
  name: string;
  rules: string[];
}
