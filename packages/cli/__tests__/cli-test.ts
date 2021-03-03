import { CheckupProject } from '@checkup/test-helpers';
import * as execa from 'execa';

describe('cli-test', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('react', '^15.0.0');
      project.addDependency('react-dom', '^15.0.0');
    });
    project.files['index.js'] = 'module.exports = {};';
    project.files['index.hbs'] = '<div>Checkup App</div>';

    project.addCheckupConfig({
      plugins: [],
      tasks: {},
    });
    project.writeSync();
    project.gitInit();
    project.install();
  });

  afterEach(function () {
    project.dispose();
  });

  it('outputs top level help', async () => {
    let result = await run([]);

    expect(result).toMatchInlineSnapshot(`
      [Error: Command failed with exit code 1: /Users/scalvert/.volta/tools/image/node/12.16.2/bin/node /Users/scalvert/workspace/personal/checkup/packages/cli/bin/checkup.js

       A health checkup for your project

       checkup <command> [options]

      Commands:
        checkup run <paths> [options]                  Runs configured checkup tasks  [aliases: r]
        checkup generate <generator> <name> [options]  Runs a generator to scaffold Checkup code  [aliases: g]

      Options:
        --help     Show help  [boolean]
        --version  Show version number  [boolean]]
    `);
  });
});

function run(args: string[], options: execa.Options = {}) {
  let defaults = {
    reject: false,
    cwd: options.cwd || process.cwd(),
  };

  return execa(
    process.execPath,
    [require.resolve('../bin/checkup.js'), ...args],
    Object.assign(defaults, options)
  );
}
