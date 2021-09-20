type ParserWithOptions<TAst> = (source: string, parserOptions?: any) => TAst;
type Parser<TAst> = (source: string) => TAst;

/**
 * A class for generic AST analysis.
 *
 * @export
 * @class AstAnalyzer
 * @template TAst
 * @template TVisitors
 * @template TParse
 * @template TTraverse
 */
export default class AstAnalyzer<
  TAst,
  TVisitors,
  TParse extends Parser<TAst> | ParserWithOptions<TAst>,
  TTraverse extends (ast: TAst, visitors: TVisitors) => any
> {
  ast: TAst;

  constructor(
    public source: string,
    private parser: TParse,
    private traverser: TTraverse,
    private parserOptions: object = {}
  ) {
    this.ast = this._parse(source);
  }

  private _parse(source: string): TAst {
    let ast: TAst;

    try {
      ast = this.parser(source, this.parserOptions);
    } catch (error) {
      throw new Error(error);
    }

    return ast;
  }

  analyze(visitors: TVisitors) {
    this.traverser(this.ast, visitors);
  }
}
