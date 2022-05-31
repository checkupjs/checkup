import {
  BaseMigrationTask,
  ESLintOptions,
  LintAnalyzer,
  Task,
  TemplateLintConfig,
  TemplateLintReport,
  TaskContext,
  ESLintAnalyzer,
  EmberTemplateLintAnalyzer,
  NormalizedLintResult,
  LintResult,
  resolveModulePath,
} from '@checkup/core';
import { Result } from 'sarif';

const OCTANE_ES_LINT_CONFIG: ESLintOptions = {
  baseConfig: {
    parser: resolveModulePath('@babel/eslint-parser'),
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        legacyDecorators: true,
      },
      requireConfigFile: false,
    },
    plugins: ['ember'],
    env: {
      browser: true,
    },
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
  },
  ignore: false,
  allowInlineConfig: false,
  useEslintrc: false,
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

export default class EmberOctaneMigrationStatusTask extends BaseMigrationTask implements Task {
  taskName = 'ember-octane-migration-status';
  taskDisplayName = 'Ember Octane Migration Status';
  description =
    'Tracks the migration status when moving from Ember Classic to Ember Octane in an Ember.js project';
  category = 'migrations';
  group = 'ember';

  private eslintAnalyzer: LintAnalyzer<LintResult[]>;
  private emberTemplateLintAnalyzer: LintAnalyzer<TemplateLintReport>;

  constructor(pluginName: string, context: TaskContext) {
    super('Octane', pluginName, context);

    this.eslintAnalyzer = new ESLintAnalyzer(OCTANE_ES_LINT_CONFIG, this.config);
    this.emberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(
      OCTANE_TEMPLATE_LINT_CONFIG,
      this.config
    );

    this.addRuleComponentMetadata();

    this.addFeature('ember/no-classic-classes', {
      featureName: 'Native Classes',
      message: 'Use native JS classes to extend the built-in classes provided by Ember',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
    });

    this.addFeature('ember/classic-decorator-no-classic-methods', {
      featureName: 'Native Classes',
      message: 'Do not use classic API methods within a class',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
    });

    this.addFeature('ember/classic-decorator-hooks', {
      featureName: 'Native Classes',
      message: 'Use constructor over init',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-lifecycle__constructors',
    });

    this.addFeature('ember/no-actions-hash', {
      featureName: 'Native Classes',
      message: 'Do not use the actions hash and {{action}} modifier and helper',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__actions',
    });

    this.addFeature('ember/no-component-lifecycle-hooks', {
      featureName: 'Glimmer Components',
      message: 'Do not use "classic" Ember component lifecycle hooks.',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-lifecycle',
    });

    this.addFeature('ember/no-get', {
      featureName: 'Native Classes',
      message: 'Use native ES5 getters instead of `get` / `getProperties` on Ember objects',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__get-and-set',
    });

    this.addFeature('ember/no-get-with-default', {
      featureName: 'Native Classes',
      message: 'Use native ES5 getters with || or ternary operators',
      helpUri:
        'https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md',
    });

    this.addFeature('ember/no-jquery', {
      featureName: 'Glimmer Components',
      message: 'Use native DOM APIs over jQuery',
      helpUri:
        'https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-jquery.md',
    });

    this.addFeature('ember/no-mixins', {
      featureName: 'Native Classes',
      message: 'Do not use mixins, as they no longer work with native classes',
      helpUri: 'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__mixins',
    });

    this.addFeature('ember/require-tagless-components', {
      featureName: 'Tagless Components',
      message: 'Use tagless components to avoid unnecessary outer element wrapping',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__tag-name',
    });

    this.addFeature('ember/no-classic-components', {
      featureName: 'Glimmer Components',
      message: 'Use Glimmer components over classic Ember Components',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
    });

    this.addFeature('ember/no-computed-properties-in-native-classes', {
      featureName: 'Tracked Properties',
      message: 'Use tracked properties over computed properties',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__tracked-vs-cp',
    });

    this.addFeature('no-curly-component-invocation', {
      featureName: 'Angle Bracket Syntax',
      message:
        'Use angle bracket syntax as it improves readability of templates, i.e. disambiguates components from helpers',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__angle-brackets',
    });

    this.addFeature('no-args-paths', {
      featureName: 'Named Arguments',
      message: 'Use arguments prefixed with the @ symbol to pass arguments to components',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-named',
    });

    this.addFeature('no-implicit-this', {
      featureName: 'Own Properties',
      message: 'Use `this` when referring to properties owned by the component',
      helpUri:
        'https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-this',
    });

    this.addFeature('no-action', {
      featureName: 'Modifiers',
      message: 'Do not use `action`. Instead, use the `on` modifier and `fn` helper',
      helpUri: 'https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers',
    });
  }

  async run(): Promise<Result[]> {
    let [eslintResults, templateLintReport] = await Promise.all([
      this.runEsLint(),
      this.runTemplateLint(),
    ]);

    return this.buildResults([...eslintResults, ...templateLintReport.results]);
  }

  private runEsLint(): Promise<LintResult[]> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');

    return this.eslintAnalyzer.analyze(jsPaths);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.emberTemplateLintAnalyzer.analyze(hbsPaths);
  }

  buildResults(results: LintResult[]): Result[] {
    let rawData = this.flattenLintResults(results);

    rawData.forEach((lintResult: NormalizedLintResult) => {
      let ruleId = lintResult.lintRuleId;
      let feature = this.features.get(ruleId);

      if (feature) {
        this.addFeatureResult(feature, {
          location: {
            uri: lintResult.filePath,
            startColumn: lintResult.column,
            startLine: lintResult.line,
            endColumn: lintResult.endColumn,
            endLine: lintResult.endLine,
          },
        });
      }
    });

    return this.results;
  }
}
