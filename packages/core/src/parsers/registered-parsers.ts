import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from '../types/parsers';

import { createParser as createEmberTemplateLintParser } from './ember-template-lint-parser';
import { createParser as createEslintParser } from './eslint-parser';

let registeredParsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>> = new Map<
  ParserName,
  CreateParser<ParserOptions, Parser<ParserReport>>
>();

registeredParsers.set('eslint', createEslintParser);
registeredParsers.set('ember-template-lint', createEmberTemplateLintParser);

/**
 *
 */
export function getRegisteredParsers() {
  return registeredParsers;
}

/**
 * @param parserName
 * @param parser
 */
export function registerParser(
  parserName: ParserName,
  parser: CreateParser<ParserOptions, Parser<ParserReport>>
) {
  registeredParsers.set(parserName, parser);
}
