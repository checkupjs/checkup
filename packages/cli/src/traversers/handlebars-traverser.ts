import { AST, NodeVisitor } from '@glimmer/syntax';
import { parse, traverse } from 'ember-template-recast';
import { handlebarsAstCache as astCache } from '../utils/ast-cache';
import getFileContents from '../utils/get-file-contents';

/**
 * Provides an abstract implementation of a SearchTraverser aimed at
 * traversing the contents of a Handlebars file.
 */
export default abstract class HandlebarsTraverser {
  abstract get visitors(): NodeVisitor;
  fileContents!: string;

  traverseAst(fullFilePath: string) {
    this.fileContents = getFileContents(fullFilePath);

    if (!astCache.has(fullFilePath)) {
      astCache.set(fullFilePath, parse(this.fileContents));
    }

    let ast: AST.Template = astCache.get(fullFilePath);

    traverse(ast, this.visitors);
  }
}
