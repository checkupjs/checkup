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

interface CompletionInfo {
  total: number;
  completed: number;
  percentage: string;
}

export interface MigrationInfo {
  completionInfo: CompletionInfo;
  name: string;
  relatedResults: CLIEngine.LintResult[];
}

export interface MigrationRuleConfig {
  fileMatchers: RegExp[];
  name: string;
  rules: string[];
}

export interface EmberTemplateLintMessage {
  rule: string;
  severity: 0 | 1 | 2;
  moduleId: string;
  message: string;
  line: number;
  column: number;
  source: string;
}
