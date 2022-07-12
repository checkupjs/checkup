import { createRequire } from 'module';
import * as recast from 'recast';
import { File } from '@babel/types';
import traverse, { TraverseOptions } from '@babel/traverse';
import AstAnalyzer from './ast-analyzer.js';

const require = createRequire(import.meta.url);

/**
 * A class for analyzing TypeScript files.
 *
 * @export
 * @class TypeScriptAnalyzer
 * @extends {AstAnalyzer}
 */
export default class TypeScriptAnalyzer extends AstAnalyzer<
  File,
  TraverseOptions,
  typeof recast.parse,
  typeof traverse
> {
  constructor(source: string) {
    super(source, recast.parse, (<any>traverse).default, {
      parser: require('recast/parsers/typescript'),
    });
  }
}
