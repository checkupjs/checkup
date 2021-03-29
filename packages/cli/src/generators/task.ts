import * as _ from 'lodash';
import * as path from 'path';
import * as t from '@babel/types';
import * as chalk from 'chalk';
import * as recast from 'recast';

import traverse from '@babel/traverse';
import { Answers } from 'inquirer';
import BaseGenerator, { Works, Options } from './base-generator';
import { PackageJson } from 'type-fest';
import { AstTransformer, CheckupError } from '@checkup/core';

interface TaskOptions extends Options {
  taskClass: string;
  pascalCaseName: string;
  typescript: boolean;
  commandType: string;
  category: string;
  group: string;
}

export default class TaskGenerator extends BaseGenerator {
  works: Works = Works.InsidePlugin;
  packageJson!: PackageJson;
  answers!: Answers;

  constructor(args: any, public options: TaskOptions) {
    super(args, options);
  }

  initializing() {
    if (!this.canRunGenerator) {
      throw new CheckupError(
        `Can only generate tasks from inside a Checkup plugin directory`,
        `Run ${chalk.bold.white(
          'checkup generate task'
        )} from the root of a Checkup plugin or use the ${chalk.bold.white(
          '--path'
        )} option to specify the path to a Checkup plugin`
      );
    }
  }

  async prompting() {
    this.headline(`${this.options.name}-task`);

    const defaults = {
      typescript: true,
      commandType: 'info',
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
          type: 'list',
          name: 'commandType',
          message: 'Select the command this task is to be run under.',
          default: 'info',
          choices: ['run', 'validate'],
        },
        {
          type: 'input',
          name: 'category',
          message: `Enter a task category. (Categories are used to group similar tasks together to help organize the results. eg: 'best practices', 'testing', etc.)`,
        },
        {
          type: 'input',
          name: 'group',
          message: `(optional) Enter a task group. (Groups allow you to further group like tasks under categories)`,
          optional: true,
        },
      ]);
    }

    this.options.pascalCaseName = _.upperFirst(_.camelCase(this.options.name));
    this.options.taskClass = `${this.options.pascalCaseName}Task`;
    this.options.typescript = this.answers.typescript;
    this.options.commandType = this.answers.commandType;
    this.options.category = this.answers.category;
    this.options.group = this.answers.group;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates/src/task'));

    const options = { ...this.options, _ };

    if (
      !this.fs.exists(
        this.destinationPath(`${this._dir}/registrations/register-tasks.${this._ext}`)
      )
    ) {
      this.fs.copy(
        this.templatePath(`src/registrations/register-tasks.${this._ext}.ejs`),
        this.destinationPath(`${this._dir}/registrations/register-tasks.${this._ext}`)
      );
    }

    this.fs.copyTpl(
      this.templatePath(`src/tasks/task.${this._ext}.ejs`),
      this.destinationPath(`${this._dir}/tasks/${this.options.name}-task.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`__tests__/task.${this._ext}.ejs`),
      this.destinationPath(`__tests__/${this.options.name}-task-test.${this._ext}`),
      options
    );

    this._transformHooks();
  }

  private _transformHooks() {
    let hooksDestinationPath = this.destinationPath(
      `${this._dir}/registrations/register-tasks.${this._ext}`
    );

    let registerTasksSource = this.fs.read(hooksDestinationPath);
    let registerTaskStatement = t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('tasks'), t.identifier('registerTask')), [
        t.newExpression(t.identifier(this.options.taskClass), [
          t.identifier('pluginName'),
          t.identifier('context'),
        ]),
      ])
    );

    let importOrRequire: t.ImportDeclaration | t.VariableDeclaration;
    let taskPath = `../tasks/${this.options.name}-task`;

    if (this.options.typescript) {
      let newTaskImportSpecifier = t.importDefaultSpecifier(t.identifier(this.options.taskClass));
      importOrRequire = t.importDeclaration([newTaskImportSpecifier], t.stringLiteral(taskPath));
    } else {
      importOrRequire = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier(this.options.taskClass),
          t.callExpression(t.identifier('require'), [t.stringLiteral(taskPath)])
        ),
      ]);
    }

    let code = new AstTransformer(registerTasksSource, recast.parse, traverse, {
      parser: require('recast/parsers/typescript'),
    })
      .traverse({
        Program(path) {
          path.node.body.splice(1, 0, importOrRequire);
        },
        BlockStatement(path) {
          path.node.body.push(registerTaskStatement);
        },
      })
      .generate();

    this.fs.write(hooksDestinationPath, code);
  }
}
