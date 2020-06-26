import * as _ from 'lodash';
import * as path from 'path';
import * as t from '@babel/types';
import * as chalk from 'chalk';

import { Answers } from 'inquirer';
import AstTransformer from '../helpers/ast';
import BaseGenerator from './base-generator';
import { Options } from '../commands/generate';
import { PackageJson } from 'type-fest';
import { CheckupError } from '@checkup/core';

interface TaskOptions extends Options {
  taskResultClass: string;
  taskClass: string;
  pascalCaseName: string;
  typescript: boolean;
  category: string;
  group: string;
}

export default class TaskGenerator extends BaseGenerator {
  packageJson!: PackageJson;
  answers!: Answers;

  private get _ext() {
    return this.options.typescript ? 'ts' : 'js';
  }

  constructor(args: any, public options: TaskOptions) {
    super(args, options);
  }

  async prompting() {
    this.packageJson = this.fs.readJSON('package.json');

    if (
      !this.packageJson ||
      !(this.packageJson.keywords && this.packageJson.keywords.includes('oclif-plugin'))
    ) {
      throw new CheckupError(
        'Can only generate tasks in Checkup plugin directory',
        `Run ${chalk.bold.white(
          'checkup generate task'
        )} from the root of a Checkup plugin or use the ${chalk.bold.white(
          '--path'
        )} option to specify the path to a Checkup plugin`
      );
    }

    this.headline(`${this.options.name}-task`);

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
    this.options.taskResultClass = `${this.options.taskClass}Result`;
    this.options.typescript = this.answers.typescript;
    this.options.category = this.answers.category;
    this.options.group = this.answers.group;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates/src/task'));

    const options = { ...this.options, _ };

    this.fs.copyTpl(
      this.templatePath(`src/tasks/task.${this._ext}.ejs`),
      this.destinationPath(`src/tasks/${this.options.name}-task.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`src/results/task-result.${this._ext}.ejs`),
      this.destinationPath(`src/results/${this.options.name}-task-result.${this._ext}`),
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
    let hooksDestinationPath = this.destinationPath(`src/hooks/register-tasks.${this._ext}`);

    let registerTasksSource = this.fs.read(hooksDestinationPath);
    let registerTaskStatement = t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('tasks'), t.identifier('registerTask')), [
        t.newExpression(t.identifier(this.options.taskClass), [
          t.identifier('pluginName'),
          t.identifier('context'),
        ]),
      ])
    );

    let newTaskImportSpecifier = t.importDefaultSpecifier(t.identifier(this.options.taskClass));
    let tasksImportDeclaration: t.ImportDeclaration = t.importDeclaration(
      [newTaskImportSpecifier],
      t.stringLiteral(`../tasks/${this.options.name}-task`)
    );

    let code = new AstTransformer(registerTasksSource)
      .traverse({
        Program(path) {
          path.node.body.splice(1, 0, tasksImportDeclaration);
        },
        BlockStatement(path) {
          path.node.body.push(registerTaskStatement);
        },
      })
      .generate();

    this.fs.write(hooksDestinationPath, code);
  }
}
