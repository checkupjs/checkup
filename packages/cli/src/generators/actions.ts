import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as t from '@babel/types';
import * as recast from 'recast';

import traverse from '@babel/traverse';
import { Answers } from 'inquirer';
import BaseGenerator, { Works } from './base-generator';
import { Options } from '../commands/generate';
import { join } from 'path';
import { AstTransformer, CheckupError } from '@checkup/core';

interface ActionOptions extends Options {
  taskName: string;
  pascalCaseName: string;
  typescript: boolean;
}

export default class ActionsGenerator extends BaseGenerator {
  works: Works = Works.InsidePlugin;
  answers!: Answers;

  constructor(args: any, public options: ActionOptions) {
    super(args, options);
  }

  initializing() {
    if (!this.canRunGenerator) {
      throw new CheckupError(
        `Can only generate actions from inside a Checkup plugin directory`,
        `Run ${chalk.bold.white(
          'checkup generate actions'
        )} from the root of a Checkup plugin or use the ${chalk.bold.white(
          '--path'
        )} option to specify the path to a Checkup plugin`
      );
    }
  }

  async prompting() {
    this.headline(`${this.options.name}-actions`);

    const defaults = {
      typescript: true,
    };

    if (this.options.defaults) {
      this.answers = defaults;
    } else {
      this.answers = await this.prompt([
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
    }

    this.options.taskName = this.answers.taskName;
    this.options.pascalCaseName = _.upperFirst(_.camelCase(this.options.name));
    this.options.typescript = this.answers.typescript;
  }

  writing() {
    this.sourceRoot(join(__dirname, '../../templates/src/actions'));

    if (
      !this.fs.exists(
        this.destinationPath(`${this._dir}/registrations/register-actions.${this._ext}`)
      )
    ) {
      this.fs.copy(
        this.templatePath(`src/registrations/register-actions.${this._ext}.ejs`),
        this.destinationPath(`${this._dir}/registrations/register-actions.${this._ext}`)
      );
    }

    this.fs.copyTpl(
      this.templatePath(`src/actions/actions.${this._ext}.ejs`),
      this.destinationPath(`${this._dir}/actions/${this.options.name}-actions.${this._ext}`),
      this.options
    );

    this._transformHooks();
  }

  private _transformHooks() {
    let hooksDestinationPath = this.destinationPath(
      `${this._dir}/registrations/register-actions.${this._ext}`
    );

    let registerActionsSource = this.fs.read(hooksDestinationPath);
    let registerActionStatement = t.expressionStatement(
      t.callExpression(t.identifier('registerActions'), [
        t.stringLiteral(this.options.taskName),
        t.identifier(`evaluate${this.options.pascalCaseName}Actions`),
      ])
    );

    let newActionImportSpecifier = t.importSpecifier(
      t.identifier(`evaluate${this.options.pascalCaseName}Actions`),
      t.identifier('evaluateActions')
    );
    let tasksImportDeclaration: t.ImportDeclaration = t.importDeclaration(
      [newActionImportSpecifier],
      t.stringLiteral(`../actions/${this.options.name}-actions`)
    );

    let code = new AstTransformer(registerActionsSource, recast.parse, traverse, {
      parser: require('recast/parsers/typescript'),
    })
      .traverse({
        Program(path) {
          path.node.body.splice(1, 0, tasksImportDeclaration);
        },
        BlockStatement(path) {
          path.node.body.push(registerActionStatement);
        },
      })
      .generate();

    this.fs.write(hooksDestinationPath, code);
  }
}
