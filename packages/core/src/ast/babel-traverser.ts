import { File, Node } from '@babel/types';
import * as parser from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';
import AstTraverser from './ast-traverser';

export default class BabelTraverser extends AstTraverser<
  File,
  TraverseOptions<Node>,
  typeof parser.parse,
  typeof traverse
> {
  constructor(source: string) {
    super(source, parser.parse, traverse);
  }
}
