export type ParserName = string;
export type ParserOptions = Record<string, any>;
export type ParserReport = any;
export interface Parser<ParserReport> {
  execute(paths: string[]): Promise<ParserReport>;
}

export interface CreateParser<ParserOptions, TParser = Parser<ParserReport>> {
  (config: ParserOptions): TParser;
}
