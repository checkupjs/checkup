import * as recast from 'recast';
import * as t from '@babel/types';

import traverse, { TraverseOptions } from '@babel/traverse';

/**
 * @class AstTransformer
 *
 * @example
 *
 * let code = new AstTransformer(source)
 *              .traverse(visitors)
 *              .generate();
 */
export default class AstTransformer {
  ast!: t.File;
  constructor(public source: string) {
    this.ast = this._parse(source);
  }
  private _parse(source: string): t.File {
    return recast.parse(source, { parser: require('recast/parsers/typescript') });
  }
  traverse(visitors: TraverseOptions): AstTransformer {
    traverse(this.ast, visitors);
    return this;
  }
  generate(): string {
    return recast.print(this.ast, { quote: 'single', wrapColumn: 100 }).code;
  }
}
