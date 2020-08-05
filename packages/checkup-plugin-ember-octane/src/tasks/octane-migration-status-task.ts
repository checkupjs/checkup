import {
  BaseTask,
  ESLintReport,
  Parser,
  Task,
  TaskContext,
  TemplateLintReport,
  TemplateLinter,
  ESLintOptions,
  TemplateLintConfig,
  buildLintResultDataItem,
  LintResult,
  ESLintResult,
  buildMultiValueResult,
  byRuleIds,
  TemplateLintResult,
  MultiValueResult,
  ESLintMessage,
  TemplateLintMessage,
} from '@checkup/core';

import OctaneMigrationStatusTaskResult from '../results/octane-migration-status-task-result';

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

export default class OctaneMigrationStatusTask extends BaseTask implements Task {
  meta = {
    taskName: 'octane-migration-status',
    friendlyTaskName: 'Ember Octane Migration Status',
    taskClassification: {
      category: 'migrations',
      group: 'ember',
    },
  };

  private eslintParser: Parser<ESLintReport>;
  private templateLinter: TemplateLinter;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    let createEmberTemplateLintParser = this.context.parsers.get('ember-template-lint')!;

    this.eslintParser = createEslintParser(OCTANE_ES_LINT_CONFIG);
    this.templateLinter = createEmberTemplateLintParser(OCTANE_TEMPLATE_LINT_CONFIG);
  }

  async run(): Promise<OctaneMigrationStatusTaskResult> {
    let [esLintReport, templateLintReport] = await Promise.all([
      this.runEsLint(),
      this.runTemplateLint(),
    ]);

    let result = new OctaneMigrationStatusTaskResult(this.meta, this.config);

    let octaneResults = buildResult(
      [...esLintReport.results, ...templateLintReport.results],
      this.context.cliFlags.cwd
    );

    result.process(octaneResults);

    return result;
  }

  private async runEsLint(): Promise<ESLintReport> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');

    return this.eslintParser.execute(jsPaths);
  }

  private async runTemplateLint(): Promise<TemplateLintReport> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');

    return this.templateLinter.execute(hbsPaths);
  }
}

function buildResult(
  lintResults: (ESLintResult | TemplateLintResult)[],
  cwd: string
): MultiValueResult[] {
  let rawData = lintResults.reduce((resultDataItems, lintResult) => {
    let messages = (<any>lintResult.messages).map(
      (lintMessage: ESLintMessage | TemplateLintMessage) => {
        return buildLintResultDataItem(lintMessage, cwd, lintResult.filePath);
      }
    );

    resultDataItems.push(...messages);

    return resultDataItems;
  }, [] as LintResult[]);

  return [
    { key: 'Native Classes', rules: NATIVE_CLASS_RULES },
    { key: 'Tagless Components', rules: TAGLESS_COMPONENTS_RULES },
    { key: 'Glimmer Components', rules: GLIMMER_COMPONENTS_RULES },
    { key: 'Tracked Propeties', rules: TRACKED_PROPERTIES_RULES },
    { key: 'Angle Brackets Syntax', rules: ANGLE_BRACKETS_SYNTAX_RULES },
    { key: 'Named Arguments', rules: NAMED_ARGUMENTS_RULES },
    { key: 'Own Properties', rules: OWN_PROPERTIES_RULES },
    { key: 'Modifiers', rules: USE_MODIFIERS_RULES },
  ].map(({ key, rules }) => {
    return buildMultiValueResult(key, byRuleIds(rawData, rules), 'ruleId', rules);
  });
}
