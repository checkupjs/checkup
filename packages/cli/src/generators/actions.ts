import { join } from 'path';
import { createRequire } from 'module';
import * as _ from 'lodash';
import * as t from '@babel/types';
import * as recast from 'recast';
import traverse from '@babel/traverse';
import { Answers } from 'inquirer';
import { AstTransformer, CheckupError, ErrorKind, dirname } from '@checkup/core';
import BaseGenerator, { Works, Options } from './base-generator.js';

interface ActionOptions extends Options {
  taskName: string;
  pascalCaseName: string;
  typescript: boolean;
}

const require = createRequire(import.meta.url);

export default class ActionsGenerator extends BaseGenerator {
  works: Works = Works.InsidePlugin;
  answers!: Answers;

  constructor(args: any, public options: ActionOptions) {
    super(args, options);
  }

  initializing() {
    if (!this.canRunGenerator) {
      throw new CheckupError(ErrorKind.GeneratorWorkContextNotValid, { type: 'actions' });
    }
  }

  async prompting() {
    this.headline(`${this.options.name}-actions`);

    const defaults = {
      typescript: true,
    };

    this.answers = this.options.defaults
      ? defaults
      : await this.prompt([
          {
            type: 'confirm',
            name: 'typescript',
            message: 'TypeScript',
            default: () => true,
          },
          {
            type: 'input',
            name: 'taskName',
            message: `Enter the task name that these actions will be associated with (the string value in the taskName property of the task class).`,
          },
        ]);

    this.options.taskName = this.answers.taskName;
    this.options.pascalCaseName = _.upperFirst(_.camelCase(this.options.name));
    this.options.typescript = this.answers.typescript;
  }

  writing() {
    this.sourceRoot(join(dirname(import.meta), '../../templates/src/actions'));

    this.fs.copyTpl(
      this.templatePath(`src/actions/actions.${this._ext}.ejs`),
      this.destinationPath(`${this._dir}/actions/${this.options.name}-actions.${this._ext}`),
      this.options
    );

    this._transformHooks();
  }

  private _transformHooks() {
    let registrationDestinationPath = this.destinationPath(`${this._dir}/index.${this._ext}`);
    let registerActionsSource = this.fs.read(registrationDestinationPath);

    let taskName = this.options.taskName;
    let importOrRequire: t.ImportDeclaration | t.VariableDeclaration;
    let actionsPath = `../actions/${this.options.name}-actions`;
    let actionsAlias = `evaluate${this.options.pascalCaseName}Actions`;

    let newActionImportSpecifier = t.importSpecifier(
      t.identifier(actionsAlias),
      t.identifier('evaluateActions')
    );
    importOrRequire = t.importDeclaration([newActionImportSpecifier], t.stringLiteral(actionsPath));

    let transformer = new AstTransformer(registerActionsSource, recast.parse, traverse, {
      parser: require('recast/parsers/typescript'),
    });

    transformer.analyze({
      Program(nodePath) {
        nodePath.unshiftContainer('body', importOrRequire);
      },
      ExportDefaultDeclaration(nodePath) {
        let pluginExportedObject = nodePath.node.declaration as t.ObjectExpression;
        let actions: t.ObjectExpression;

        if (pluginExportedObject.properties.length === 0) {
          pluginExportedObject.properties.push(
            t.objectProperty(t.identifier('actions'), t.objectExpression([]))
          );
        }

        actions = (pluginExportedObject.properties[0] as t.ObjectProperty)
          .value as t.ObjectExpression;

        actions.properties.push(
          t.objectProperty(t.stringLiteral(taskName), t.identifier(actionsAlias))
        );
      },
    });

    let code = transformer.generate();

    this.fs.write(registrationDestinationPath, code);
  }
}
