import * as fs from 'fs';
import {
  Task,
  BaseTask,
  trimCwd,
  NormalizedLintResult,
  AstAnalyzer,
  TaskContext,
} from '@checkup/core';
import * as t from '@babel/types';
import { parse, visit } from 'recast';
import { Visitor } from 'ast-types';
import { Result } from 'sarif';

const ESLINT_DISABLE_REGEX = /^eslint-disable(?:-next-line|-line)*/gi;

export default class EslintDisableTask extends BaseTask implements Task {
  taskName = 'eslint-disables';
  taskDisplayName = 'Number of eslint-disable Usages';
  description = 'Finds all disabled eslint rules in a project';
  category = 'linting';
  group = 'disabled-lint-rules';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'list',
          options: {
            items: {
              'Disabled rules': {
                groupBy: 'level',
                value: 'note',
              },
            },
          },
        },
      },
    });
  }

  async run(): Promise<Result[]> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');
    let eslintDisables: NormalizedLintResult[] = await getEslintDisables(
      jsPaths,
      this.context.options.cwd
    );

    eslintDisables.forEach((disable) => {
      this.addResult(disable.message, 'review', 'note', {
        location: {
          uri: disable.filePath,
          startColumn: disable.column,
          startLine: disable.line,
        },
        properties: {
          ruleId: disable.lintRuleId,
        },
      });
    });

    return this.results;
  }
}

async function getEslintDisables(filePaths: string[], cwd: string) {
  let data: NormalizedLintResult[] = [];

  class ESLintDisableAccumulator {
    data: NormalizedLintResult[] = [];

    constructor(private filePath: string) {}

    add(node: any) {
      this.data.push({
        filePath: trimCwd(this.filePath, cwd),
        lintRuleId: 'no-eslint-disable',
        message: 'eslint-disable usages',
        line: node.loc.start.line,
        column: node.loc.start.column,
        endLine: node.loc.end.line,
        endColumn: node.loc.end.column,
      });
    }

    get visitors(): Visitor<any> {
      let self = this;

      return {
        visitComment: function (path: any) {
          if (ESLINT_DISABLE_REGEX.test(path.value.value.trim())) {
            self.add(path.value);
          }

          this.traverse(path);
        },
      };
    }
  }

  await Promise.all(
    filePaths.map((filePath) => {
      return fs.promises.readFile(filePath, 'utf8').then((fileContents: string) => {
        let accumulator = new ESLintDisableAccumulator(filePath);
        let analyzer = new AstAnalyzer<t.File, Visitor<any>, typeof parse, typeof visit>(
          fileContents,
          parse,
          visit,
          {
            parser: require('recast/parsers/babel'),
          }
        );

        analyzer.analyze(accumulator.visitors);
        data.push(...accumulator.data);
      });
    })
  );

  return data;
}
