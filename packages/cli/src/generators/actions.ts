import { join } from 'path';
import * as _ from 'lodash';
import * as t from '@babel/types';
import * as recast from 'recast';

import traverse from '@babel/traverse';
import { Answers } from 'inquirer';
import { AstTransformer, CheckupError, ErrorKind } from '@checkup/core';
import BaseGenerator, { Works, Options } from './base-generator';

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
    this.sourceRoot(join(__dirname, '../../templates/src/actions'));

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
    let registerActionStatement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.memberExpression(t.identifier('args'), t.identifier('register')),
          t.identifier('actions')
        ),
        [
          t.stringLiteral(this.options.taskName),
          t.identifier(`evaluate${this.options.pascalCaseName}Actions`),
        ]
      )
    );

    let importOrRequire: t.ImportDeclaration | t.VariableDeclaration;
    let actionsPath = `../actions/${this.options.name}-actions`;
    let actionsAlias = `evaluate${this.options.pascalCaseName}Actions`;

    if (this.options.typescript) {
      let newActionImportSpecifier = t.importSpecifier(
        t.identifier(actionsAlias),
        t.identifier('evaluateActions')
      );
      importOrRequire = t.importDeclaration(
        [newActionImportSpecifier],
        t.stringLiteral(actionsPath)
      );
    } else {
      importOrRequire = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.objectPattern([
            t.objectProperty(t.identifier('evaluateActions'), t.identifier(actionsAlias)),
          ]),
          t.callExpression(t.identifier('require'), [t.stringLiteral(actionsPath)])
        ),
      ]);
    }

    let code = new AstTransformer(registerActionsSource, recast.parse, traverse, {
      parser: require('recast/parsers/typescript'),
    })
      .analyze({
        Program(path) {
          path.node.body.splice(1, 0, importOrRequire);
        },
        BlockStatement(path) {
          path.node.body.push(registerActionStatement);
        },
      })
      .generate();

    this.fs.write(registrationDestinationPath, code);
  }
}
