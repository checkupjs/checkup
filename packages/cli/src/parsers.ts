import { Parser, ParserName } from '@checkup/core';

let registeredParsers: Map<ParserName, Parser> = new Map<ParserName, Parser>();

export function getRegisteredParsers() {
  return registeredParsers;
}

export function registerParser(parserName: ParserName, parser: Parser) {
  registeredParsers.set(parserName, parser);
}
