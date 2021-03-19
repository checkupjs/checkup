export default class AstTraverser<
  TAst,
  TVisitors,
  TParse extends (source: string, parserOptions?: any) => TAst,
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

  traverse(visitors: TVisitors) {
    this.traverser(this.ast, visitors);

    return this;
  }
}
