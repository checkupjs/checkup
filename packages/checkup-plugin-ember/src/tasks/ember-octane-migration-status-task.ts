import {
  BaseTask,
  sarifBuilder,
  byRuleIds,
  ESLintOptions,
  ESLintReport,
  ESLintResult,
  Parser,
  Task,
  TemplateLintConfig,
  TemplateLinter,
  TemplateLintReport,
  TemplateLintResult,
  groupDataByField,
  lintBuilder,
  TaskContext,
} from '@checkup/core';
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

const NATIVE_CLASS_RULES = [
  'ember/no-classic-classes',
  'ember/classic-decorator-no-classic-methods',
  'ember/no-actions-hash',
  'ember/no-get',
  'ember/no-mixins',
];
const TAGLESS_COMPONENTS_RULES = ['ember/require-tagless-components'];
const GLIMMER_COMPONENTS_RULES = ['ember/no-classic-components'];
const TRACKED_PROPERTIES_RULES = ['ember/no-computed-properties-in-native-classes'];
const ANGLE_BRACKETS_SYNTAX_RULES = ['no-curly-component-invocation'];
const NAMED_ARGUMENTS_RULES = ['no-args-paths'];
const OWN_PROPERTIES_RULES = ['no-implicit-this'];
const USE_MODIFIERS_RULES = ['no-action'];

const CUSTOM_RULE_MESSAGES = {
  'ember/no-classic-classes':
    'Octane | Native Classes : Use native JS classes to extend the built-in classes provided by Ember. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  'ember/classic-decorator-no-classic-methods':
    'Octane | Native Classes : Do not use classic API methods within a class. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  'ember/no-actions-hash':
    'Octane | Native Classes : Do not use the actions hash and {{action}} modifier and helper. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__actions',
  'ember/no-get':
    'Octane | Native Classes : Use native ES5 getters instead of `get` / `getProperties` on Ember objects. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__get-and-set',
  'ember/no-mixins':
    'Octane | Native Classes : Do not use mixins, as they no longer work with native classes. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#actions__mixins',
  'ember/require-tagless-components':
    'Octane | Tagless Components : Use tagless components to avoid unnecessary outer element wrapping. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__tag-name',
  'ember/no-classic-components':
    'Octane | Glimmer Components : Use Glimmer components over classic Ember Components. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__js-boilerplate',
  'ember/no-computed-properties-in-native-classes':
    'Octane | Tracked Properties : Use tracked properties over computed properties. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-properties__tracked-vs-cp',
  'no-curly-component-invocation':
    'Octane | Angle Bracket Syntax : Use angle bracket syntax as it improves readability of templates, i.e. disambiguates components from helpers. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__angle-brackets',
  'no-args-paths':
    'Octane | Named Arguments : Use arguments prefixed with the @ symbol to pass arguments to components. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-named',
  'no-implicit-this':
    'Octane | Own Properties : Use `this` when referring to properties owned by the component. More info: https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/#component-templates__template-this',
  'no-action':
    'Octane | Modifiers : Do not use `action`. Instead, use the `on` modifier and `fn` helper. More info: https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/',
};

export default class EmberOctaneMigrationStatusTask extends BaseTask implements Task {
  taskName = 'ember-octane-migration-status';
  taskDisplayName = 'Ember Octane Migration Status';
  category = 'migrations';
  group = 'ember';

  private eslintParser: Parser<ESLintReport>;
  private templateLinter: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    let createEmberTemplateLintParser = this.context.parsers.get('ember-template-lint')!;

    this.eslintParser = createEslintParser(OCTANE_ES_LINT_CONFIG, this.config);
    this.templateLinter = createEmberTemplateLintParser(OCTANE_TEMPLATE_LINT_CONFIG, this.config);
  }

  async run(): Promise<Result[]> {
    let [esLintReport, templateLintReport] = await Promise.all([
      this.runEsLint(),
      this.runTemplateLint(),
    ]);

    return this.buildResult(
      [...esLintReport.results, ...templateLintReport.results],
      this.context.options.cwd
    );
  }

  private async runEsLint(): Promise<ESLintReport> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');

    return this.eslintParser.execute(jsPaths);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.templateLinter.execute(hbsPaths);
  }

  buildResult(results: (ESLintResult | TemplateLintResult)[], cwd: string): Result[] {
    let rawData = lintBuilder.toLintResults(results, cwd);

    return [
      { key: 'Native Classes', rules: NATIVE_CLASS_RULES },
      { key: 'Tagless Components', rules: TAGLESS_COMPONENTS_RULES },
      { key: 'Glimmer Components', rules: GLIMMER_COMPONENTS_RULES },
      { key: 'Tracked Properties', rules: TRACKED_PROPERTIES_RULES },
      { key: 'Angle Brackets Syntax', rules: ANGLE_BRACKETS_SYNTAX_RULES },
      { key: 'Named Arguments', rules: NAMED_ARGUMENTS_RULES },
      { key: 'Own Properties', rules: OWN_PROPERTIES_RULES },
      { key: 'Modifiers', rules: USE_MODIFIERS_RULES },
    ].flatMap(({ rules, key }) => {
      let resultsByRuleId = groupDataByField(byRuleIds(rawData, rules), 'lintRuleId');

      return resultsByRuleId.flatMap((resultsForRuleId) => {
        return sarifBuilder.fromLintResults(
          this,
          resultsForRuleId,
          {
            resultGroup: key,
          },
          CUSTOM_RULE_MESSAGES
        );
      });
    });
  }
}
