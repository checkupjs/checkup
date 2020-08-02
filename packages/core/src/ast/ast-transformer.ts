import * as recast from 'recast';
import * as t from '@babel/types';
import traverse, { TraverseOptions } from '@babel/traverse';

import AstTraverser from './ast-traverser';

type RecastParse = typeof recast.parse;
type BabelTraverse = typeof traverse;

/**
 * @class AstTransformer
 *
 * @example
 *
 * let code = new AstTransformer(source)
 *              .traverse(visitors)
 *              .generate();
 */
export default class AstTransformer extends AstTraverser<
  t.File,
  TraverseOptions,
  RecastParse,
  BabelTraverse
> {
  generate(): string {
    return recast.print(this.ast, { quote: 'single', wrapColumn: 100 }).code;
  }
}
