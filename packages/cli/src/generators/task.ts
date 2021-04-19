import * as path from 'path';
import * as _ from 'lodash';
import * as t from '@babel/types';
import * as recast from 'recast';

import traverse from '@babel/traverse';
import { Answers } from 'inquirer';
import { PackageJson } from 'type-fest';
import { AstTransformer, CheckupError, ErrorKind } from '@checkup/core';
import BaseGenerator, { Works, Options } from './base-generator';

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
      throw new CheckupError(ErrorKind.GeneratorWorkContextNotValid, { type: 'task' });
    }
  }

  async prompting() {
    this.headline(`${this.options.name}-task`);

    const defaults = {
      typescript: true,
      commandType: 'info',
      category: '',
      group: '',
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

    this._addRegistration();
  }

  private _addRegistration() {
    let registrationDestinationPath = this.destinationPath(`${this._dir}/index.${this._ext}`);

    // builds a task source in the form of
    // args.register.task(new FooTask(pluginName, args.context));
    let registerTasksSource = this.fs.read(registrationDestinationPath);
    let registerTaskStatement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.memberExpression(t.identifier('args'), t.identifier('register')),
          t.identifier('task')
        ),
        [
          t.newExpression(t.identifier(this.options.taskClass), [
            t.identifier('pluginName'),
            t.memberExpression(t.identifier('args'), t.identifier('context')),
          ]),
        ]
      )
    );

    let importOrRequire: t.ImportDeclaration | t.VariableDeclaration;
    let taskPath = `./tasks/${this.options.name}-task`;

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

    this.fs.write(registrationDestinationPath, code);
  }
}
