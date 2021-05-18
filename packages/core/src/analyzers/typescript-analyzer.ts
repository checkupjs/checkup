import * as recast from 'recast';
import { File } from '@babel/types';
import traverse, { TraverseOptions } from '@babel/traverse';

import AstAnalyzer from './ast-analyzer';

export default class TypeScriptAnalyzer extends AstAnalyzer<
  File,
  TraverseOptions,
  typeof recast.parse,
  typeof traverse
> {
  constructor(source: string) {
    super(source, recast.parse, traverse, {
      parser: require('recast/parsers/typescript'),
    });
  }
}
