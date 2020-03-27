import { ESLintMigrationType, MigrationTaskConfig, TemplateLintMigrationType } from '../types';

export const ESLINT_MIGRATION_TASK_CONFIGS: {
  [Key in ESLintMigrationType]: MigrationTaskConfig;
} = {
  [ESLintMigrationType.NativeClasses]: {
    fileMatchers: [
      /app\/app\.js$/,
      /(app|addon)\/(adapters|components|controllers|helpers|models|routes|services)\/.*\.js$/,
    ],
    name: 'Native Class',
    rules: [
      'ember/no-classic-classes',
      'ember/classic-decorator-no-classic-methods',
      'ember/no-actions-hash',
      'ember/no-get',
    ],
  },
  [ESLintMigrationType.TaglessComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tagless Component',
    rules: ['ember/require-tagless-components'],
  },
  [ESLintMigrationType.GlimmerComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Glimmer Component',
    rules: ['ember/no-classic-components'],
  },
  [ESLintMigrationType.TrackedProperties]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tracked Properties',
    rules: ['ember/no-computed-properties-in-native-classes'],
  },
};

export const TEMPLATE_LINT_MIGRATION_TASK_CONFIGS: {
  [Key in TemplateLintMigrationType]: MigrationTaskConfig;
} = {
  [TemplateLintMigrationType.AngleBrackets]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Angle Brackets',
    rules: ['no-curly-component-invocation'],
  },
  [TemplateLintMigrationType.NamedArgs]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Use Named Arguments',
    rules: ['no-args-paths'],
  },
  [TemplateLintMigrationType.OwnProperties]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Own Properties',
    rules: ['no-implicit-this'],
  },
  [TemplateLintMigrationType.UseModifiers]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Use Modifiers',
    rules: ['no-action'],
  },
};
