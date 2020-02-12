import { File } from '@babel/types';
import { AST } from '@glimmer/syntax';

/**
 * Allows for caching already processed AST for subsequent access.
 */
class AstCache<T> {
  cache: Map<string, T>;

  constructor() {
    this.cache = new Map<string, T>();
  }

  get(filePath: string) {
    return this.cache.get(filePath)!;
  }

  set(filePath: string, ast: T) {
    this.cache.set(filePath, ast);
  }

  has(filePath: string) {
    return this.cache.has(filePath);
  }

  clear(): void {
    this.cache = new Map<string, T>();
  }
}

export const javascriptAstCache = new AstCache<File>();
export const handlebarsAstCache = new AstCache<AST.Template>();
