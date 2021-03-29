import { Task, BaseTask, trimCwd, LintResult, AstTraverser, sarifBuilder } from '@checkup/core';

import * as t from '@babel/types';
import { parse, visit } from 'recast';
import { Visitor } from 'ast-types';
import { Result } from 'sarif';

const fs = require('fs');

const ESLINT_DISABLE_REGEX = /^eslint-disable(?:-next-line|-line)*/gi;

export default class EslintDisableTask extends BaseTask implements Task {
  taskName = 'eslint-disables';
  taskDisplayName = 'Number of eslint-disable Usages';
  category = 'linting';
  group = 'disabled-lint-rules';

  async run(): Promise<Result[]> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');
    let eslintDisables: LintResult[] = await getEslintDisables(jsPaths, this.context.options.cwd);

    return sarifBuilder.fromLintResults(this, eslintDisables);
  }
}

async function getEslintDisables(filePaths: string[], cwd: string) {
  let data: LintResult[] = [];

  class ESLintDisableAccumulator {
    data: LintResult[] = [];

    constructor(private filePath: string) {}

    add(node: any) {
      this.data.push({
        filePath: trimCwd(this.filePath, cwd),
        lintRuleId: 'no-eslint-disable',
        message: 'eslint-disable usages',
        line: node.loc.start.line,
        column: node.loc.start.column,
      });
    }

    get visitors(): Visitor<any> {
      let self = this;

      return {
        visitComment: function (path: any) {
          if (path.value.value.trim().match(ESLINT_DISABLE_REGEX)) {
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
        let astTraverser = new AstTraverser<t.File, Visitor<any>, typeof parse, typeof visit>(
          fileContents,
          parse,
          visit,
          {
            parser: require('recast/parsers/babel'),
          }
        );

        astTraverser.traverse(accumulator.visitors);
        data.push(...accumulator.data);
      });
    })
  );

  return data;
}
