import * as execa from 'execa';
import { FakeProject } from './__utils__/fake-project';

const ROOT = process.cwd();

jest.setTimeout(100000);

describe('cli-test', () => {
  let project: FakeProject;

  beforeEach(function () {
    project = new FakeProject('checkup-app', '0.0.0', () => {});
    project.files['index.js'] = 'module.exports = {};';
    project.files['index.hbs'] = '<div>Checkup App</div>';

    project.writeSync();
    project.gitInit();
    project.chdir();
  });

  afterEach(function () {
    process.chdir(ROOT);
    project.dispose();
  });

  it('outputs top level help', async () => {
    let result = await run([]);

    expect(result.exitCode).toEqual(0);
    expect(result.stderr).toMatchInlineSnapshot(`
      "
       A health checkup for your project ✅

       checkup <command> [options]

      Commands:
        checkup run <paths> [options]  Runs configured checkup tasks  [aliases: r]
        checkup generate               Runs a generator to scaffold Checkup code  [aliases: g]

      Options:
        --help     Show help  [boolean]
        --version  Show version number  [boolean]"
    `);
  });

  it('outputs help for run command', async () => {
    let result = await run(['run']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchInlineSnapshot(`
      "checkup run <paths> [options]

      Runs configured checkup tasks

      Options:
            --help           Show help  [boolean]
            --version        Show version number  [boolean]
        -e, --exclude-paths  Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.
        -c, --config         Use this configuration, overriding .checkuprc if present.
        -d, --cwd            The path referring to the root directory that Checkup will run in  [default: (default)]
            --category       Runs specific tasks specified by category. Can be used multiple times.
            --group          Runs specific tasks specified by group. Can be used multiple times.
        -t, --task           Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.
        -f, --format         The output format, one of stdout, json  [default: \\"stdout\\"]
        -o, --output-file    Specify file to write JSON output to. Requires the \`--format\` flag to be set to \`json\`  [default: \\"\\"]
        -l, --list-tasks     List all available tasks to run.  [boolean]

      Not enough non-option arguments: got 0, need at least 1"
    `);
  });

  it('outputs help for generate command', async () => {
    let result = await run(['generate']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchInlineSnapshot(`
      "checkup generate

      Runs a generator to scaffold Checkup code

      Commands:
        checkup generate plugin <name> [options]   Generates a checkup plugin project
        checkup generate task <name> [options]     Generates a checkup task within a project
        checkup generate actions <name> [options]  Generates checkup actions within a project
        checkup generate config                    Generates a .checkuprc within a project

      Options:
        --help     Show help  [boolean]
        --version  Show version number  [boolean]"
    `);
  });

  it('should output checkup result', async () => {
    let result = await run(['run', '.', '--cwd', project.baseDir]);

    let output = result.stdout.trim().split('\n');
    output[7] = '<outputPath>';

    expect(output).toEqual([
      'Checkup report generated for checkup-app v0.0.0 (3 files analyzed)',
      '',
      'This project is 0 days old, with 0 days active days, 0 commits and 0 files.',
      '',
      'Checkup ran the following task(s) successfully:',
      '',
      'Results have been saved to the following file:',
      '<outputPath>',
      '',
      'checkup v0.0.0',
      'config dd17cda1fc2eb2bc6bb5206b41fc1a84',
    ]);
  });

  it('should output list of available tasks', async () => {
    project.install();
    let pluginDir = await project.addPlugin(
      { name: 'my-plugin', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'my-task', defaults: false },
      { typescript: false, category: 'best practices' },
      pluginDir
    );

    project.addCheckupConfig({
      $schema:
        'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json',
      excludePaths: [],
      plugins: ['checkup-plugin-my-plugin'],
      tasks: {},
    });

    let result = await run(['run', '.', '--list-tasks']);

    expect(result.stdout).toMatchInlineSnapshot(`
      "
      AVAILABLE TASKS

        my-plugin/my-task
      "
    `);
  });

  function run(args: string[], options: execa.Options = {}) {
    let defaults = {
      reject: false,
      cwd: project.baseDir,
    };

    return execa(
      process.execPath,
      [require.resolve('../bin/checkup.js'), ...args],
      Object.assign({}, defaults, options)
    );
  }
});
