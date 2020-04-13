import { CLIEngine } from 'eslint';
import { TemplateLintResult } from '@checkup/core';

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

type LintResultCollection = CLIEngine.LintResult[] | TemplateLintResult[];

interface CompletionInfo {
  total: number;
  completed: number;
  percentage: string;
}

export interface MigrationInfo {
  completionInfo: CompletionInfo;
  name: string;
  relatedResults: LintResultCollection;
}

export interface MigrationTaskConfig {
  fileMatchers: RegExp[];
  name: string;
  rules: string[];
}
