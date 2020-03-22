import * as Generator from 'yeoman-generator';
import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as path from 'path';
import * as t from '@babel/types';

import { Category, Priority } from '@checkup/core';

import AstTransformer from '../helpers/ast';
import { Options } from '../commands/generate';
import { PackageJson } from 'type-fest';

interface TaskOptions extends Options {
  taskResultClass: string;
  taskClass: string;
  pascalCaseName: string;
  typescript: boolean;
  category: string;
  priority: string;
}

const { version } = require('../../package.json');

export default class TaskGenerator extends Generator {
  packageJson!: PackageJson;

  answers!: {
    typescript: boolean;
    category: string;
    priority: string;
  };

  private get _ts() {
    let devDeps = this.packageJson.devDependencies;
    return (devDeps !== undefined && devDeps.typescript) || this.options.typescript;
  }

  private get _ext() {
    return this._ts ? 'ts' : 'js';
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
      throw new Error('not in a plugin directory');
    }

    this.log(
      `Adding a ${chalk.bold.white(this.options.name)} task to ${chalk.bold.white(
        this.packageJson.name
      )} Version: ${chalk.bold.white(version)}`
    );

    const defaults = {
      typescript: true,
      category: Category.Core,
      priority: Priority.Low,
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
          name: 'category',
          message: 'Select a task category',
          choices: [
            { name: 'core', value: 'Core' },
            { name: 'migration', value: 'Migration' },
            { name: 'insights', value: 'Insights' },
          ],
          default: 'Core',
        },
        {
          type: 'list',
          name: 'priority',
          message: 'Select a task priority',
          choices: [
            { name: 'high', value: 'High' },
            { name: 'medium', value: 'Medium' },
            { name: 'low', value: 'Low' },
          ],
          default: 'Low',
        },
      ]);
    }

    this.options.pascalCaseName = _.upperFirst(_.camelCase(this.options.name));
    this.options.taskClass = `${this.options.pascalCaseName}Task`;
    this.options.taskResultClass = `${this.options.taskClass}Result`;
    this.options.typescript = this.answers.typescript;
    this.options.category = this.answers.category;
    this.options.priority = this.answers.priority;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates'));

    const options = { ...this.options, _ };

    this.fs.copyTpl(
      this.templatePath(`src/task/task.${this._ext}.ejs`),
      this.destinationPath(`src/tasks/${this.options.name}-task.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`src/task/task-result.${this._ext}.ejs`),
      this.destinationPath(`src/results/${this.options.name}-task-result.${this._ext}`),
      options
    );

    this.fs.copyTpl(
      this.templatePath(`src/__tests__/task.${this._ext}.ejs`),
      this.destinationPath(`__tests__/${this.options.name}-task-test.${this._ext}`),
      options
    );

    this._transformTasksIndex();
    this._transformHooks();
  }

  private _transformTasksIndex() {
    let tasksIndexPath = this.destinationPath(`src/tasks/index.${this._ext}`);

    let tasksIndexSource = this.fs.read(tasksIndexPath);
    let exportStatement = t.exportNamedDeclaration(
      null,
      [t.exportSpecifier(t.identifier('default'), t.identifier(this.options.taskClass))],
      t.stringLiteral(`./${this.options.name}-task`)
    );

    let code = new AstTransformer(tasksIndexSource)
      .traverse({
        Program(path) {
          path.node.body.push(exportStatement);
        },
      })
      .generate();

    this.fs.write(tasksIndexPath, code);
  }

  private _transformHooks() {
    let hooksDestinationPath = this.destinationPath(`src/hooks/register-tasks.${this._ext}`);

    let registerTasksSource = this.fs.read(hooksDestinationPath);
    let registerTaskStatement = t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('tasks'), t.identifier('registerTask')), [
        t.newExpression(t.identifier(this.options.taskClass), [t.identifier('cliArguments')]),
      ])
    );

    let newTaskImportSpecifier = t.importSpecifier(
      t.identifier(this.options.taskClass),
      t.identifier(this.options.taskClass)
    );
    let tasksImportDeclaration: t.ImportDeclaration = t.importDeclaration(
      [newTaskImportSpecifier],
      t.stringLiteral('../tasks')
    );

    let code = new AstTransformer(registerTasksSource)
      .traverse({
        Program(path) {
          let existingImportDeclaration: t.ImportDeclaration[] = path.node.body.filter(
            node => t.isImportDeclaration(node) && node.source.value === '../tasks'
          ) as t.ImportDeclaration[];

          if (existingImportDeclaration.length > 0) {
            existingImportDeclaration.pop()!.specifiers.push(newTaskImportSpecifier);
          } else {
            path.node.body.splice(1, 0, tasksImportDeclaration);
          }
        },
        BlockStatement(path) {
          path.node.body.push(registerTaskStatement);
        },
      })
      .generate();

    this.fs.write(hooksDestinationPath, code);
  }
}
