import FixturifyProject = require('fixturify-project');
import Project = require('./node_modules/ember-cli/lib/models/project');

interface EmberCLIFixturifyProject extends FixturifyProject {
  addAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  addDevAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  addInRepoAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  buildProjectModel(ProjectClass?: new () => Project): Project;
  dispose: (filepath?: string) => void;
}

/* eslint-disable no-undef */
export = EmberCLIFixturifyProject;
