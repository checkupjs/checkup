import { isAbsolute, join, relative } from 'path';

export function toAbsolute(baseDir: string, filePath: string) {
  let absolutePath = filePath;

  if (!isAbsolute(filePath)) {
    absolutePath = join(baseDir, filePath);
  }

  return absolutePath;
}

export function toRelative(baseDir: string, filePath: string) {
  let relativePath = filePath;

  if (isAbsolute(relativePath)) {
    relativePath = relative(baseDir, filePath);
  }

  return relativePath;
}
