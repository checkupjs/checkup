import {
  BaseValidationTask,
  ESLintAnalyzer,
  ESLintOptions,
  Task,
  TaskContext,
} from '@checkup/core';
import semver from 'semver';
import { Result } from 'sarif';

const ESLINT_CONFIG: ESLintOptions = {
  baseConfig: {
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        legacyDecorators: true,
      },
    },
    rules: {
      strict: ['error', 'never'],
    },
  },
  useEslintrc: false,
  allowInlineConfig: false,
  ignore: false,
};

export default class ValidEsmPackageTask extends BaseValidationTask implements Task {
  taskName = 'valid-esm-package';
  taskDisplayName = 'Valid ESM Package';
  description = 'Validates whether a project is a valid ESM package';
  category = 'validation';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'validation',
        },
      },
    });

    this.addValidationSteps();
  }

  private addValidationSteps() {
    let pkg = this.context.pkg;

    this.addValidationStep('Contains "type" property set to "module" in package.json', () => {
      return {
        isValid: !!(pkg.type && pkg.type === 'module'),
      };
    });

    this.addValidationStep('Does not contain a "main" property in package.json', () => {
      return {
        isValid: !('main' in pkg),
      };
    });

    this.addValidationStep(
      'Contains an "exports" property set to a valid value in package.json',
      () => {
        let exports = pkg.exports;
        return {
          isValid: !!(
            exports &&
            (typeof exports === 'string' ||
              (Array.isArray(exports) && exports.every((value) => typeof value === 'string')) ||
              (typeof exports === 'object' && exports !== null))
          ),
        };
      }
    );

    this.addValidationStep(
      'Requires at least Node 13 in the "engines" property of package.json',
      () => {
        // Node 13.2.0 was the first Node version that shipped with ESM without the --experimental-module flag.
        return {
          isValid: !!(
            pkg.engines &&
            pkg.engines['node'] &&
            semver.satisfies('13.2.0', pkg.engines['node'])
          ),
        };
      }
    );

    this.addValidationStep('Should not have "use strict" in any JavaScript files', async () => {
      let analyzer = new ESLintAnalyzer(ESLINT_CONFIG);

      let results = await analyzer.analyze(this.context.paths.filterByGlob('**/*.js'));
      let hasErrors = results.some((result) => result.messages.length > 0);

      return {
        isValid: !hasErrors,
      };
    });
  }

  async run(): Promise<Result[]> {
    let validationResults = await this.validate();

    for (let [messageText, validationResult] of validationResults) {
      this.addValidationResult(messageText, validationResult.isValid);
    }

    return this.results;
  }
}
