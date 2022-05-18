import * as recast from 'recast';
import { File } from '@babel/types';
import traverse, { TraverseOptions } from '@babel/traverse';

import AstAnalyzer from '../analyzers/ast-analyzer.js';

type RecastParse = typeof recast.parse;
type BabelTraverse = typeof traverse;

/**
 * A class used for code generation.
 *
 * @export
 * @class AstTransformer
 * @extends {AstAnalyzer<File, TraverseOptions, RecastParse, BabelTraverse>}
 */
export default class AstTransformer extends AstAnalyzer<
  File,
  TraverseOptions,
  RecastParse,
  BabelTraverse
> {
  generate(): string {
    return recast.print(this.ast, { quote: 'single', wrapColumn: 100 }).code;
  }
}
