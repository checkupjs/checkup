const hash = require('promise.hash.helper');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const COMMIT_COUNT = "git log --oneline $commit | wc -l | tr -d ' '";
const FILE_COUNT = "git ls-files | wc -l | tr -d ' '";
const REPO_AGE =
  'git log --reverse --pretty=oneline --format=" % ar" | head -n 1 | LC_ALL=C sed \'s/ago//\'';
const ACTIVE_DAYS = `git log --pretty='format: %ai' $1 | cut -d ' ' -f 2 | sort -r | uniq | awk '
    { sum += 1 }
    END { print sum }
  '`;

export function getRepositoryInfo() {
  return hash({
    commitCount: Number(exec(COMMIT_COUNT)),
    filesCount: Number(exec(FILE_COUNT)),
    age: String(exec(REPO_AGE)),
    activeDays: String(exec(ACTIVE_DAYS)),
  });
}
