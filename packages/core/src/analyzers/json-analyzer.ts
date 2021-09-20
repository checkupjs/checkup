import JavaScriptAnalyzer from './javascript-analyzer';

/**
 * A class for analyzing JSON files.
 *
 * @export
 * @class JsonAnalyzer
 * @extends {JavaScriptAnalyzer}
 */
export default class JsonAnalyzer extends JavaScriptAnalyzer {
  constructor(source: string) {
    // In order to process JSON, we need to convert it to a module,
    // as babel cannot parse JSON natively.
    let jsonSource = `module.exports = ${source}`;

    super(jsonSource);
  }
}
