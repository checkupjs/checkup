import { AST, NodeVisitor, parse, traverse } from 'ember-template-recast';
import AstAnalyzer from './ast-analyzer';

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
