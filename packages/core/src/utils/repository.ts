import hash from 'promise.hash.helper';
import { RepositoryInfo } from '../types/checkup-result';
import { exec } from './exec.js';

const COMMIT_COUNT = "git log --oneline $commit | wc -l | tr -d ' '";
const FILE_COUNT = "git ls-files | wc -l | tr -d ' '";
const REPO_AGE =
  'git log --reverse --pretty=oneline --format=" % ar" | head -n 1 | LC_ALL=C sed \'s/ago//\'';
const ACTIVE_DAYS = `git log --pretty='format: %ai' $1 | cut -d ' ' -f 2 | sort -r | uniq | awk '
    { sum += 1 }
    END { print sum }
  '`;

/**
 * Gets the git repository info
 *
 * @param {string} baseDir - The base directory from which to gather the repository info
 * @returns {*}  {Promise<RepositoryInfo>}
 */
export function getRepositoryInfo(baseDir: string): Promise<RepositoryInfo> {
  return hash({
    totalCommits: exec(COMMIT_COUNT, { cwd: baseDir }, 0, Number),
    totalFiles: exec(FILE_COUNT, { cwd: baseDir }, 0, Number),
    age: exec(REPO_AGE, { cwd: baseDir }, '0 days'),
    activeDays: exec(ACTIVE_DAYS, { cwd: baseDir }, '0 days'),
  });
}
