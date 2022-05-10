import { AST, NodeVisitor, parse, traverse } from 'ember-template-recast';
import AstAnalyzer from './ast-analyzer.js';

/**
 * A class for analyzing .hbs files using ember-template-recast.
 *
 * @export
 * @class HandlebarsAnalyzer
 * @extends {AstAnalyzer}
 */
export default class HandlebarsAnalyzer extends AstAnalyzer<
  AST.Template,
  NodeVisitor,
  typeof parse,
  typeof traverse
> {
  constructor(source: string) {
    super(source, parse, traverse);
  }
}
