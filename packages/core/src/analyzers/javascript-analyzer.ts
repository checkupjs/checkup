import { createRequire } from 'module';
import * as t from '@babel/types';
import { parse, visit } from 'recast';
import { Visitor } from 'ast-types';
import AstAnalyzer from './ast-analyzer.js';

const require = createRequire(import.meta.url);

/**
 * A class for analyzing JavaScript files.
 *
 * @export
 * @class JavaScriptAnalyzer
 * @extends {AstAnalyzer}
 */
export default class JavaScriptAnalyzer extends AstAnalyzer<
  t.File,
  Visitor<any>,
  typeof parse,
  typeof visit
> {
  constructor(source: string) {
    super(source, parse, visit, {
      parser: require('recast/parsers/babel'),
    });
  }
}
