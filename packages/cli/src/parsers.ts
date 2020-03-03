import { Parser, ParserName } from '@checkup/core';

let registeredParsers: Map<ParserName, Parser> = new Map<ParserName, Parser>();

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
export function registerParser(parserName: ParserName, parser: Parser) {
  registeredParsers.set(parserName, parser);
}
