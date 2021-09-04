import {
  BaseTask,
  ESLintOptions,
  ESLintReport,
  LintAnalyzer,
  Task,
  TemplateLintConfig,
  TemplateLinter,
  TemplateLintReport,
  TaskContext,
  ESLintAnalyzer,
  EmberTemplateLintAnalyzer,
  NormalizedLintResult,
  LintResult,
} from '@checkup/core';
import kebabCase = require('lodash.kebabcase');
import { Result } from 'sarif';

const OCTANE_ES_LINT_CONFIG: ESLintOptions = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  envs: ['browser'],
  rules: {
    'ember/classic-decorator-hooks': 'error',
    'ember/classic-decorator-no-classic-methods': 'error',
    'ember/no-actions-hash': 'error',
    'ember/no-classic-classes': 'error',
    'ember/no-classic-components': 'error',
    'ember/no-component-lifecycle-hooks': 'error',
    'ember/no-computed-properties-in-native-classes': 'error',
    'ember/no-get-with-default': 'error',
    'ember/no-get': 'error',
    'ember/no-jquery': 'error',
    'ember/require-tagless-components': 'error',
    'ember/no-mixins': 'error',
  },
  useEslintrc: false,
  allowInlineConfig: false,
  ignore: false,
};

const OCTANE_TEMPLATE_LINT_CONFIG: TemplateLintConfig = {
  rules: {
    'no-action': 'error',
    'no-args-paths': 'error',
    'no-curly-component-invocation': [
      'error',
      {
        noImplicitThis: 'error',
        requireDash: 'off',
      },
    ],
    'no-implicit-this': 'error',
  },
};

const RULE_METADATA: Record<
  string,
  {
    feature: string;
    message: string;
    helpUri: string;
  }
> = {
  'ember/no-classic-classes': {
    feature: 'Native Classes',
    message: 'Use native JS classes to extend the built-in classes provided by Ember',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  },
  'ember/classic-decorator-no-classic-methods': {
    feature: 'Native Classes',
    message: 'Do not use classic API methods within a class',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  },
  'ember/classic-decorator-hooks': {
    feature: 'Native Classes',
    message: 'Use constructor over init',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-lifecycle__constructors',
  },
  'ember/no-actions-hash': {
    feature: 'Native Classes',
    message: 'Do not use the actions hash and {{action}} modifier and helper',
    helpUri: 'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__actions',
  },
  'ember/no-component-lifecycle-hooks': {
    feature: 'Glimmer Components',
    message: 'Do not use "classic" Ember component lifecycle hooks.',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-lifecycle',
  },
  'ember/no-get': {
    feature: 'Native Classes',
    message: 'Use native ES5 getters instead of `get` / `getProperties` on Ember objects',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__get-and-set',
  },
  'ember/no-get-with-default': {
    feature: 'Native Classes',
    message: 'Use native ES5 getters with || or ternary operators',
    helpUri:
      'https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md',
  },
  'ember/no-jquery': {
    feature: 'Glimmer Components',
    message: 'Use native DOM APIs over jQuery',
    helpUri: 'https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-jquery.md',
  },
  'ember/no-mixins': {
    feature: 'Native Classes',
    message: 'Do not use mixins, as they no longer work with native classes',
    helpUri: 'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__mixins',
  },
  'ember/require-tagless-components': {
    feature: 'Tagless Components',
    message: 'Use tagless components to avoid unnecessary outer element wrapping',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__tag-name',
  },
  'ember/no-classic-components': {
    feature: 'Glimmer Components',
    message: 'Use Glimmer components over classic Ember Components',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  },
  'ember/no-computed-properties-in-native-classes': {
    feature: 'Tracked Properties',
    message: 'Use tracked properties over computed properties',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__tracked-vs-cp',
  },
  'no-curly-component-invocation': {
    feature: 'Angle Bracket Syntax',
    message:
      'Use angle bracket syntax as it improves readability of templates, i.e. disambiguates components from helpers',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__angle-brackets',
  },
  'no-args-paths': {
    feature: 'Named Arguments',
    message: 'Use arguments prefixed with the @ symbol to pass arguments to components',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-named',
  },
  'no-implicit-this': {
    feature: 'Own Properties',
    message: 'Use `this` when referring to properties owned by the component',
    helpUri:
      'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-this',
  },
  'no-action': {
    feature: 'Modifiers',
    message: 'Do not use `action`. Instead, use the `on` modifier and `fn` helper',
    helpUri: 'https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers',
  },
};

export default class EmberOctaneMigrationStatusTask extends BaseTask implements Task {
  taskName = 'ember-octane-migration-status';
  taskDisplayName = 'Ember Octane Migration Status';
  description =
    'Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project';
  category = 'migrations';
  group = 'ember';

  private eslintAnalyzer: LintAnalyzer<ESLintReport>;
  private emberTemplateLintAnalyzer: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.eslintAnalyzer = new ESLintAnalyzer(OCTANE_ES_LINT_CONFIG, this.config);
    this.emberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(
      OCTANE_TEMPLATE_LINT_CONFIG,
      this.config
    );
  }

  async run(): Promise<Result[]> {
    let [esLintReport, templateLintReport] = await Promise.all([
      this.runEsLint(),
      this.runTemplateLint(),
    ]);

    return this.buildResults([...esLintReport.results, ...templateLintReport.results]);
  }

  private runEsLint(): Promise<ESLintReport> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');

    return this.eslintAnalyzer.analyze(jsPaths);
  }

  private runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.emberTemplateLintAnalyzer.analyze(hbsPaths);
  }

  buildResults(results: LintResult[]): Result[] {
    let rawData = this.flattenLintResults(results);

    rawData.forEach((lintResult: NormalizedLintResult) => {
      let ruleId = lintResult.lintRuleId ?? '';
      let ruleMetadata = RULE_METADATA[ruleId];

      this.addResult(
        `Octane | ${ruleMetadata.feature} : ${ruleMetadata.message}. More info: ${ruleMetadata.helpUri}`,
        'review',
        'warning',
        {
          location: {
            uri: lintResult.filePath,
            startColumn: lintResult.column,
            startLine: lintResult.line,
            endColumn: lintResult.endColumn,
            endLine: lintResult.endLine,
          },
          properties: {
            migration: {
              name: 'ember-octane-migration',
              displayName: 'Ember Octane Migration',
              feature: kebabCase(ruleMetadata.feature),
              featureDisplayName: ruleMetadata.feature,
            },
          },
          rule: {
            properties: {
              component: 'list',
            },
          },
        }
      );
    });

    return this.results;
  }
}
