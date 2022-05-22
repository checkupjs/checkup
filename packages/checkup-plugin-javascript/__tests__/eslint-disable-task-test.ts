import '@microsoft/jest-sarif';
import { getPluginName } from '@checkup/core';
import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import EslintDisableTask from '../src/tasks/eslint-disable-task';

describe('eslint-disable-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(import.meta.url);

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.js'] = `
    // eslint-disable-line no-eval

    function foo(obj) { // adding this here because without babel parser, recast fails on this
      return {     // eslint-disable-line
        ...obj
      }
    }
    `;

    project.files['decorator.js'] = `
      /* eslint-disable */

      @decorated
      export default class Bar {
        barBaz() {
          return baz.toLowerCase();
        }
      }
    `;

    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to json', async () => {
    const results = await new EslintDisableTask(
      pluginName,
      getTaskContext({
        paths: project.filePaths,
        options: { cwd: project.baseDir },
      })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });

  it('captures a non-fatal error for nonparsable files', async () => {
    project.files['error-file.js'] = `
      let config;

      try {
        const metaName = '{{MODULE_PREFIX}}/config/environment';
        const rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
        config = JSON.parse(unescape(rawConfig));
      } catch(err) {
        config = {{CONFIG_CONTENTS}};
      }

      export default config;
    `;

    project.writeSync();

    const task = new EslintDisableTask(
      pluginName,
      getTaskContext({
        paths: project.filePaths,
        options: { cwd: project.baseDir },
      })
    );

    await task.run();

    expect(task.nonFatalErrors).toHaveLength(1);
    expect(task.nonFatalErrors[0].message).toEqual(
      `Error occurred at ${project.root}/foo/error-file.js. Unexpected token (9:18)`
    );
  });
});
