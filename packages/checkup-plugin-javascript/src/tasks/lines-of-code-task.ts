import { extname } from 'path';
import { promises as fs } from 'fs';
import { BaseTask, Task, TaskContext, trimCwd } from '@checkup/core';
import { Result } from 'sarif';
import sloc from 'sloc';

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED = new Set(sloc.extensions);

export default class LinesOfCodeTask extends BaseTask implements Task {
  taskName = 'lines-of-code';
  taskDisplayName = 'Lines Of Code';
  description = 'Counts lines of code within a project';
  category = 'info';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'table',
          options: {
            sumBy: {
              findGroupBy: 'Language',
              sumValueBy: 'Total Lines',
            },
            rows: {
              Language: 'properties.extension',
              'Total Lines': 'properties.lines',
            },
          },
        },
      },
    });
  }

  async run(): Promise<Result[]> {
    let fileInfos = await this.getLinesOfCode();

    fileInfos.forEach((fileInfo) => {
      this.addResult(
        `Lines of code count for ${fileInfo.filePath} - total lines: ${fileInfo.lines}`,
        'informational',
        'note',
        {
          location: {
            uri: fileInfo.filePath,
          },
          properties: Object.assign({}, fileInfo),
        }
      );
    });

    return this.results;
  }

  async getLinesOfCode() {
    let fileInfos: Array<{
      filePath: string;
      extension: string;
      lines: number;
    }> = [];

    await Promise.all(
      this.context.paths
        .filter((filePath) => {
          let extension: sloc.Extension = getExtension(filePath);

          return FILE_EXTENSIONS_SUPPORTED.has(extension);
        })
        .map(async (filePath) => {
          const contents = await fs.readFile(filePath, 'utf8');
          let extension = getExtension(filePath);
          let { total } = sloc(contents, extension);
          fileInfos.push({
            filePath: trimCwd(filePath, this.context.options.cwd),
            extension,
            lines: total,
          });
        })
    );

    return fileInfos;
  }
}

function getExtension(filePath: string): sloc.Extension {
  return extname(filePath).replace('.', '') as sloc.Extension;
}
