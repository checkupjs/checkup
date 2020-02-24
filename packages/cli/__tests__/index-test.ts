import { stdout } from '@checkup/test-helpers';
import Project = require('fixturify-project');
import cmd = require('../src');
const FixturifyProject = require('fixturify-project');

describe('@checkup/cli', () => {
  let project: Project;

  beforeEach(function() {
    project = new FixturifyProject('checkup-project', '0.0.0');
    project.addDevDependency('@checkup/plugin-ember', '0.0.0');
    project.files['.checkuprc'] = JSON.stringify({
      plugins: ['@checkup/plugin-ember'],
      tasks: [],
    });
    project.writeSync();
  });

  afterEach(function() {
    project.dispose();
  });

  it('should output checkup result', async () => {
    await cmd.run([project.baseDir]);

    expect(stdout()).toMatchSnapshot();
  });

  it('should output checkup result in JSON', async () => {
    await cmd.run(['--json', project.baseDir]);

    expect(stdout()).toMatchSnapshot();
  });
});
