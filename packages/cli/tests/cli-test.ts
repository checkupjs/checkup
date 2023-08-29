import '@microsoft/jest-sarif';
import { join, resolve } from 'path';
import { createRequire } from 'module';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import execa from 'execa';
import stringify from 'json-stable-stringify';
import { dirname, trimCwd } from '@checkup/core';
import type { Log } from 'sarif';
import fs from 'fs-extra';
import stripAnsi from 'strip-ansi';
import { FakeProject } from './__utils__/fake-project';

const ROOT = process.cwd();
const require = createRequire(import.meta.url);

describe('cli-test', () => {
  let project: FakeProject;

  beforeEach(function () {
    project = new FakeProject('checkup-app', '0.0.0', () => {});
    project.files['index.js'] = '';
    project.files['index.hbs'] = '<div>Checkup App</div>';

    project.writeSync();
    project.gitInit();
    project.chdir();
  });

  afterEach(function () {
    process.chdir(ROOT);
    project.dispose();
  });

  it('can output top level help', async () => {
    let result = await run([]);

    expect(result.exitCode).toEqual(0);
    expect(result.stderr).toMatchInlineSnapshot(`
      "
       A health checkup for your project ✅

       checkup <command> [options]

      Commands:
        checkup run       Runs configured checkup tasks  [aliases: r]
        checkup generate  Runs a generator to scaffold Checkup code  [aliases: g]

      Options:
        --help     Show help  [boolean]
        --version  Show version number  [boolean]"
    `);
  });

  it('can output help for run command', async () => {
    let result = await run(['run']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchInlineSnapshot(`
      "checkup run [paths..] [options]

      Options:
            --help             Show help  [boolean]
            --version          Show version number  [boolean]
        -e, --exclude-paths    Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.  [array]
        -c, --config-path      Use the configuration found at this path, overriding .checkuprc if present.  [default: \\".checkuprc\\"]
            --config           Use this configuration, overriding .checkuprc if present.
        -d, --cwd              The path referring to the root directory that Checkup will run in  [default: (default)]
            --category         Runs specific tasks specified by category. Can be used multiple times.  [array]
            --group            Runs specific tasks specified by group. Can be used multiple times.  [array]
        -t, --task             Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.  [array]
        -f, --format           Use a specific output format  [default: \\"summary\\"]
        -o, --output-file      Specify file to write JSON output to.  [default: \\"\\"]
        -l, --list-tasks       List all available tasks to run.  [boolean]
        -p, --plugin-base-dir  The base directory where Checkup will load the plugins from. Defaults to cwd."
    `);
  });

  it('can output help for generate command', async () => {
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

  it('can output checkup result', async () => {
    let result = await run(['run', '.']);

    expect(result.stdout).toContain(
      'Checkup report generated for checkup-app v0.0.0 (3 files analyzed)'
    );
    expect(result.stdout).toMatch(/.*checkup v.*/);
    expect(result.stdout).toContain('config dd17cda1fc2eb2bc6bb5206b41fc1a84');
  });

  it('can output list of available tasks', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run(['run', '--list-tasks']);

    expect(result.stdout).toMatchInlineSnapshot(`
      "
      AVAILABLE TASKS

        fake/foo
      "
    `);
  });

  it('can output checkup result in JSON', async () => {
    let result = await run(['run', '.', '--format', 'json']);
    let output = JSON.parse(trimCwd(result.stdout, project.baseDir)) as Log;

    expect(output).toBeValidSarifLog();
  });

  it('can output a json file in a custom directory if the json format and output-file options are provided', async () => {
    let result = await run([
      'run',
      '.',
      '--format',
      'json',
      `--output-file`,
      join(project.baseDir, 'my-checkup-file.json'),
    ]);

    let output = result.stdout.trim();
    let outputPath = output.split('\n')[1]; // output will be a string followed by newline then the file path

    expect(outputPath).toMatch(/^(.*)\/my-checkup-file.json/);
    expect(existsSync(outputPath)).toEqual(true);

    unlinkSync(outputPath);
  });

  it('can output a json file in a custom directory if the summary format and output-file options are provided', async () => {
    let result = await run([
      'run',
      '.',
      `--output-file`,
      join(project.baseDir, 'my-checkup-file.sarif'),
    ]);

    let summaryOutput = result.stdout.trim();

    expect(summaryOutput).toContain('my-checkup-file.sarif');
  });

  it('can load relative formatter', async function () {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    project.write({
      'custom-formatter.js': `
              class CustomFormatter {
                constructor(options) {
                  this.options = options;
                }

                format(logParser) {
                  return 'Custom formatter output';
                }
              }

              module.exports = CustomFormatter;
            `,
    });

    let result = await run(['run', '.', '--format', './custom-formatter.js']);

    expect(result.stdout).toMatchInlineSnapshot(`"Custom formatter output"`);
    expect(result.exitCode).toEqual(0);
  });

  it('can load formatter from node_modules', async function () {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let fixturePath = resolve(dirname(import.meta), '__fixtures__', 'checkup-formatter-test');
    let formatterDirPath = join(project.baseDir, 'node_modules', 'checkup-formatter-test');

    mkdirSync(formatterDirPath);
    fs.copyFileSync(join(fixturePath, 'index.js'), join(formatterDirPath, 'index.js'));
    fs.copyFileSync(join(fixturePath, 'package.json'), join(formatterDirPath, 'package.json'));

    let result = await run(['run', '.', '--format', 'checkup-formatter-test']);

    expect(result.stdout).toContain('Custom formatter output');
    expect(result.exitCode).toEqual(0);
  });

  it('can load formatter from node_modules using a short name', async function () {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let fixturePath = resolve(dirname(import.meta), '__fixtures__', 'checkup-formatter-test');
    let formatterDirPath = join(project.baseDir, 'node_modules', 'checkup-formatter-test');

    mkdirSync(formatterDirPath);
    fs.copyFileSync(join(fixturePath, 'index.js'), join(formatterDirPath, 'index.js'));
    fs.copyFileSync(join(fixturePath, 'package.json'), join(formatterDirPath, 'package.json'));

    let result = await run(['run', '.', '--format', 'test']);

    expect(result.stdout).toContain('Custom formatter output');
    expect(result.exitCode).toEqual(0);
  });

  it('can run a single task if the tasks option is specified with a single task', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'best practices', description: 'file counts', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run(['run', '.', '--task', 'fake/file-count']);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
  });

  it('can run multiple tasks if the tasks option is specified with multiple tasks', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'best practices', description: 'file counts', group: 'none' },
      pluginDir
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foo', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run([
      'run',
      '.',
      '--task',
      'fake/file-count',
      '--task',
      'fake/foo',
      '--format',
      'summary',
    ]);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
    expect(stripAnsi(result.stdout)).toContain('✔ fake/foo');
  });

  it('can run only one task if the category option is specified', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'files', description: 'file counts', group: 'none' },
      pluginDir
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'foos', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run(['run', '.', '--category', 'files']);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
    expect(stripAnsi(result.stdout)).not.toContain('✔ fake/foo');
  });

  it('can run multiple tasks if the category option is specified with multiple categories', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'files', description: 'file counts', group: 'none' },
      pluginDir
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'foos', description: 'foos', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run([
      'run',
      '.',
      '--category',
      'files',
      '--category',
      'foos',
      '--format',
      'summary',
    ]);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
    expect(stripAnsi(result.stdout)).toContain('✔ fake/foo');
  });

  it('can run only one task if the group option is specified', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'files', description: 'file counts', group: 'group1' },
      pluginDir
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'files', description: 'foos', group: 'group2' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run(['run', '.', '--group', 'group1']);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
  });

  it('can run multiple tasks if the group option is specified with multiple groups', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'files', description: 'file counts', group: 'group1' },
      pluginDir
    );
    await project.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'files', description: 'foos', group: 'group2' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
    });

    let result = await run([
      'run',
      '.',
      '--group',
      'group1',
      '--group',
      'group2',
      '--format',
      'summary',
    ]);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
    expect(stripAnsi(result.stdout)).toContain('✔ fake/foo');
  });

  it('can run a task if its passed in via command line, even if it is turned "off" in config', async () => {
    let pluginDir = await project.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await project.addTask(
      { name: 'file-count', defaults: false },
      { typescript: false, category: 'best practices', description: 'file counts', group: 'none' },
      pluginDir
    );

    project.addCheckupConfig({
      plugins: ['checkup-plugin-fake'],
      tasks: { 'fake/file-count': 'off' },
    });

    let result = await run(['run', '.', '--task', 'fake/file-count']);

    expect(stripAnsi(result.stdout)).toContain('✔ fake/file-count');
  });

  it('can use the config at the config path if provided', async () => {
    const anotherProject = new FakeProject('another-project');

    anotherProject.addCheckupConfig();
    anotherProject.writeSync();

    let result = await run([
      'run',
      '.',
      '--config-path',
      join(anotherProject.baseDir, '.checkuprc'),
      '--format',
      'summary',
    ]);

    expect(result.stdout).toContain(
      'Checkup report generated for checkup-app v0.0.0 (3 files analyzed)'
    );
    anotherProject.dispose();
  });

  it('fails gracefully if paths/folders/globs being passed into checkup dont exist', async () => {
    let result = await run(['run', 'index.js', 'bar/index.hbs', 'foo/**', 'baz/bing']);
    let filtered = result.stdout;

    result = await run(['run', '.']);

    let unfiltered = result.stdout;

    // the only file that exists in the options passed in is index.js
    expect(filtered).toContain('1 files analyzed');
    expect(unfiltered).toContain('4 files analyzed');
  });

  it('can run the tasks on the globs passed into checkup, if provided, instead of entire app', async () => {
    project.files = Object.assign(project.files, {
      foo: {
        'index.hbs': '{{!-- i should todo: write code --}}',
      },
      bar: {
        'index.js': '// TODO: write better code',
      },
      baz: {
        'index.js': '// TODO: write better code',
      },
    });

    project.writeSync();
    let result = await run(['run', '**/*.hbs', '**baz/**']);
    let filtered = result.stdout;

    result = await run(['run', '.']);

    let unfiltered = result.stdout;

    expect(filtered).toContain('3 files analyzed');
    expect(unfiltered).toContain('7 files analyzed');
  });

  it('can use the excludePaths provided by the config', async () => {
    project.addCheckupConfig({ excludePaths: ['**/*.hbs'] });
    project.writeSync();

    let result = await run(['run', '.']);
    let filtered = result.stdout;

    project.addCheckupConfig({ excludePaths: [] });
    project.writeSync();

    result = await run(['run', '.']);
    let unfiltered = result.stdout;

    expect(filtered).toContain('2 files analyzed');
    expect(unfiltered).toContain('4 files analyzed');
  });

  it('can use the excludePaths provided by the command line', async () => {
    let result = await run([
      'run',
      '.',
      '--exclude-paths',
      '**/*.hbs',
      '**/*.js',
      '--format',
      'summary',
    ]);

    let hbsJsFiltered = result.stdout;

    result = await run(['run', '.', '--exclude-paths', '**/*.hbs']);

    let hbsFiltered = result.stdout;

    expect(hbsJsFiltered).toContain('1 files analyzed');
    expect(hbsFiltered).toContain('3 files analyzed');
  });

  it('if excludePaths are provided by both the config and command line, use command line', async () => {
    project.addCheckupConfig({ excludePaths: ['**/*.js'] });
    project.writeSync();

    let result = await run(['run', '.', '--exclude-paths', '**/*.hbs']);

    let hbsFiltered = result.stdout;

    expect(hbsFiltered).toContain('2 files analyzed');

    result = await run(['run', '.']);

    let hbsJsFiltered = result.stdout;
    expect(hbsJsFiltered).toContain('3 files analyzed');
  });

  it('can correctly report error when config contains invalid key', async () => {
    project.files['.checkuprc'] = stringify({
      plugins: [],
      task: {},
    });
    project.writeSync();

    let result = await run(['run', '.']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(`data should have required property 'tasks'`);
  });

  it('can correctly report error when config contains invalid value', async () => {
    project.files['.checkuprc'] = stringify({
      plugins: [],
      tasks: [],
    });
    project.writeSync();

    let result = await run(['run', '.']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain('data.tasks should be object');
  });

  it('can correctly report error if task not found', async () => {
    project.addCheckupConfig();
    project.writeSync();

    let result = await run(['run', '.', '--task', 'foo']);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain('Cannot find the foo task.');
  });

  it('can load plugins from pluginBaseDir with a node_modules', async () => {
    let newProject = new FakeProject('random-app', '0.0.0', () => {});
    newProject.files['index.js'] = '';
    newProject.files['index.hbs'] = '<div>Random App</div>';
    newProject.chdir();
    let actualPluginDir = await newProject.addPlugin(
      { name: 'fake', defaults: false },
      { typescript: false }
    );
    await newProject.addTask(
      { name: 'foo', defaults: false },
      { typescript: false, category: 'best practices', description: 'foos', group: 'none' },
      actualPluginDir
    );
    newProject.writeSync();

    project.addCheckupConfig({
      plugins: ['fake'],
    });

    project.chdir();
    let result = await run(['run', '.', '--plugin-base-dir', newProject.baseDir]);

    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toMatch('✔ fake/foo');
  });

  it('can load plugins from nested (non-node_modules) pluginBaseDir', async () => {
    project.addCheckupConfig({
      plugins: ['checkup-plugin-nested'],
    });

    project.write({
      lib: {
        'checkup-plugin-nested': {
          'index.js': `
import FooTask from './tasks/foo-task.js';

export default {
  tasks: {
    'foo': FooTask
  }
};
`,
          'package.json': `{
  "name": "checkup-plugin-nested",
  "description": "",
  "version": "0.0.1",
  "type": "module",
  "dependencies": {
    "@checkup/core": "*"
  },
  "devDependencies": {},
  "keywords": [
    "checkup-plugin"
  ]
}
`,
          tasks: {
            'foo-task.js': `import { BaseTask } from '@checkup/core';

export default class FooTask extends BaseTask {
  taskName = 'foo';
  taskDisplayName = 'Foo';
  category = 'best practices';

  async run() {
    this.addRule();
    this.addResult('foo', 'review', 'error');
    return this.results;
  }
}
`,
          },
        },
      },
    });

    project.symlinkCorePackage();

    let result = await run(['run', '.', '--plugin-base-dir', join(project.baseDir, 'lib')]);
    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toMatch('✔ nested/foo');
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
