import { promises } from 'fs';
import { Task, BaseTask, NormalizedLintResult, trimCwd, HandlebarsAnalyzer } from '@checkup/core';
import { Result } from 'sarif';

const TEMPLATE_LINT_DISABLE = 'template-lint-disable';

export default class EmberTemplateLintDisableTask extends BaseTask implements Task {
  taskName = 'ember-template-lint-disables';
  taskDisplayName = 'Number of template-lint-disable Usages';
  description = 'Finds all disabled ember-template-lint rules in an Ember.js project';
  category = 'linting';
  group = 'disabled-lint-rules';

  async run(): Promise<Result[]> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');
    let templateLintDisables = await getTemplateLintDisables(hbsPaths, this.context.options.cwd);

    templateLintDisables.forEach((disable) => {
      this.addResult(disable.message, 'review', 'note', {
        location: {
          uri: disable.filePath,
          startColumn: disable.column,
          startLine: disable.line,
        },
        properties: {
          component: 'table',
        },
      });
    });

    return this.results;
  }
}

async function getTemplateLintDisables(filePaths: string[], cwd: string) {
  let data: NormalizedLintResult[] = [];

  class TemplateLintDisableAccumulator {
    data: NormalizedLintResult[] = [];

    constructor(private filePath: string) {}

    add(node: any) {
      this.data.push({
        filePath: trimCwd(this.filePath, cwd),
        lintRuleId: 'no-ember-template-lint-disable',
        message: 'ember-template-lint-disable usages',
        line: node.loc.start.line,
        column: node.loc.start.column,
      });
    }

    get visitors() {
      let self = this;

      return {
        MustacheCommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            self.add(node);
          }
        },
        CommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            self.add(node);
          }
        },
      };
    }
  }

  await Promise.all(
    filePaths.map((filePath) => {
      return promises.readFile(filePath, 'utf8').then((source: string) => {
        let accumulator = new TemplateLintDisableAccumulator(filePath);
        let analyzer = new HandlebarsAnalyzer(source);

        analyzer.analyze(accumulator.visitors);
        data.push(...accumulator.data);
      });
    })
  );
  return data;
}
