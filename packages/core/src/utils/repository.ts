import { extname } from 'path';
import { groupDataByField } from '../data/formatters';
import { RepositoryInfo } from '../types/checkup-result';
import { exec } from './exec';
import { FilePathArray } from './file-path-array';

const fs = require('fs');
const sloc = require('sloc');

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED = new Set(sloc.extensions);

const hash = require('promise.hash.helper');

const COMMIT_COUNT = "git log --oneline $commit | wc -l | tr -d ' '";
const FILE_COUNT = "git ls-files | wc -l | tr -d ' '";
const REPO_AGE =
  'git log --reverse --pretty=oneline --format=" % ar" | head -n 1 | LC_ALL=C sed \'s/ago//\'';
const ACTIVE_DAYS = `git log --pretty='format: %ai' $1 | cut -d ' ' -f 2 | sort -r | uniq | awk '
    { sum += 1 }
    END { print sum }
  '`;

/**
 * @param path
 */
export function getRepositoryInfo(baseDir: string, paths: FilePathArray): Promise<RepositoryInfo> {
  return hash({
    totalCommits: exec(COMMIT_COUNT, { cwd: baseDir }, 0, Number),
    totalFiles: exec(FILE_COUNT, { cwd: baseDir }, 0, Number),
    age: exec(REPO_AGE, { cwd: baseDir }, '0 days'),
    activeDays: exec(ACTIVE_DAYS, { cwd: baseDir }, '0 days'),
    linesOfCode: getLinesOfCode(baseDir, paths),
  });
}

async function getLinesOfCode(rootPath: string, paths: FilePathArray) {
  let fileInfos: Array<{
    filePath: string;
    extension: string;
    lines: number;
  }> = [];

  await Promise.all(
    paths
      .filter((filePath) => {
        let extension = getExtension(filePath);

        return FILE_EXTENSIONS_SUPPORTED.has(extension);
      })
      .map((filePath) => {
        return fs.promises.readFile(filePath, 'utf8').then((contents: string) => {
          let extension = getExtension(filePath);
          let { total } = sloc(contents, extension);

          fileInfos.push({
            filePath: filePath.replace(rootPath, ''),
            extension,
            lines: total,
          });
        });
      })
  );

  let groupedFiles = groupDataByField(fileInfos, 'extension')
    .map((filesByExtension) => {
      return filesByExtension.reduce(
        (acc, file) => {
          return { total: acc.total + file.lines, extension: file.extension };
        },
        { extension: '', total: 0 }
      );
    })
    .sort((a, b) => b.total - a.total);

  let total = groupedFiles.reduce((acc, value) => acc + value.total, 0);

  return { types: groupedFiles, total };
}

function getExtension(filePath: string) {
  return extname(filePath).replace('.', '');
}
