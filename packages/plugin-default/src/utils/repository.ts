import { RepositoryInfo } from '../types';

const hash = require('promise.hash.helper');
const util = require('util');
const execAsPromise = util.promisify(require('child_process').exec);

const COMMIT_COUNT = "git log --oneline $commit | wc -l | tr -d ' '";
const FILE_COUNT = "git ls-files | wc -l | tr -d ' '";
const REPO_AGE =
  'git log --reverse --pretty=oneline --format=" % ar" | head -n 1 | LC_ALL=C sed \'s/ago//\'';
const ACTIVE_DAYS = `git log --pretty='format: %ai' $1 | cut -d ' ' -f 2 | sort -r | uniq | awk '
    { sum += 1 }
    END { print sum }
  '`;

async function exec(
  cmd: string,
  options: any,
  defaultValue: string | number,
  toType: Function = String
) {
  const { stdout } = await execAsPromise(cmd, options);

  return toType(stdout.trim()) || defaultValue;
}

export function getRepositoryInfo(path: string): Promise<RepositoryInfo> {
  return hash({
    totalCommits: exec(COMMIT_COUNT, { cwd: path }, 0, Number),
    totalFiles: exec(FILE_COUNT, { cwd: path }, 0, Number),
    age: exec(REPO_AGE, { cwd: path }, '0 days'),
    activeDays: exec(ACTIVE_DAYS, { cwd: path }, '0 days'),
  });
}
