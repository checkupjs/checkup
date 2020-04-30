import { ESLintResult, TemplateLintResult } from '@checkup/core';

export enum ESLintMigrationType {
  NativeClasses = 'native-classes',
  TaglessComponents = 'tagless-components',
  GlimmerComponents = 'glimmer-components',
  TrackedProperties = 'tracked-properties',
  Mixins = 'mixin-usage',
}

export enum TemplateLintMigrationType {
  AngleBrackets = 'angle-brackets',
  NamedArgs = 'named-args',
  OwnProperties = 'own-properties',
  UseModifiers = 'use-modifiers',
}

type LintResultCollection = ESLintResult[] | TemplateLintResult[];

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
