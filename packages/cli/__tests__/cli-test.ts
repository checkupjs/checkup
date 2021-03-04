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
    project.chdir();
  });

  afterEach(function () {
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
        checkup run <paths> [options]                  Runs configured checkup tasks  [aliases: r]
        checkup generate <generator> <name> [options]  Runs a generator to scaffold Checkup code  [aliases: g]

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

      Positionals:
        paths  The paths or globs that checkup will operate on.  [required]

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
      "checkup generate <generator> <name> [options]

      Runs a generator to scaffold Checkup code

      Positionals:
        generator  Type of generator to run  [required] [choices: \\"config\\", \\"plugin\\", \\"task\\", \\"actions\\"]
        name       Name of the entity (kebab-case)  [required] [default: \\"\\"]

      Options:
            --help      Show help  [boolean]
            --version   Show version number  [boolean]
        -d, --defaults  Use defaults for every setting  [boolean]
        -p, --path      The path referring to the directory that the generator will run in  [default: \\".\\"]

      Not enough non-option arguments: got 0, need at least 2"
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
      Object.assign(defaults, options)
    );
  }
});
