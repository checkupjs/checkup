import {
  Task,
  TaskMetaData,
  BaseTask,
  normalizePath,
  LintResult,
  AstTraverser,
  buildSummaryResult,
  TaskResult,
} from '@checkup/core';

import * as t from '@babel/types';
import { parse } from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';

const fs = require('fs');

const ESLINT_DISABLE_REGEX = /^eslint-disable(?:-next-line|-line)*/gi;

export default class EslintDisableTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'eslint-disables',
    friendlyTaskName: 'Number of eslint-disable Usages',
    taskClassification: {
      category: 'linting',
    },
  };

  async run(): Promise<TaskResult> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');
    let eslintDisables = await getEslintDisables(jsPaths, this.context.cliFlags.cwd);

    return this.toJson([buildSummaryResult('eslint-disable', eslintDisables)]);
  }
}

async function getEslintDisables(filePaths: string[], cwd: string) {
  let data: LintResult[] = [];

  class ESLintDisableAccumulator {
    data: LintResult[] = [];

    constructor(private filePath: string) {}

    get visitors(): TraverseOptions {
      let add = (node: any) => {
        this.data.push({
          filePath: normalizePath(this.filePath, cwd),
          ruleId: 'no-eslint-disable',
          message: 'eslint-disable is not allowed',
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
      };

      return {
        Program: function (node: any) {
          node.container.comments.forEach((comment: t.Comment) => {
            if (comment.value.trim().match(ESLINT_DISABLE_REGEX)) {
              add(comment);
            }
          });
        },
      };
    }
  }

  await Promise.all(
    filePaths.map((filePath) => {
      return fs.promises.readFile(filePath, 'utf8').then((fileContents: string) => {
        let accumulator = new ESLintDisableAccumulator(filePath);
        let astTraverser = new AstTraverser<t.File, TraverseOptions, typeof parse, typeof traverse>(
          fileContents,
          parse,
          traverse,
          {
            sourceType: 'module',
          }
        );

        astTraverser.traverse(accumulator.visitors);
        data.push(...accumulator.data);
      });
    })
  );

  return data;
}
