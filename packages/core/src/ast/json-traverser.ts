import BabelTraverser from './babel-traverser';

export default class JsonTraverser extends BabelTraverser {
  constructor(source: string) {
    // In order to process JSON, we need to convert it to a module,
    // as babel cannot parse JSON natively.
    let jsonSource = `module.exports = ${source}`;

    super(jsonSource);
  }
}
