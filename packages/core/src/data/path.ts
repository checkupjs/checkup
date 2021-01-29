export function normalizePath(path: string, cwd: string) {
  return path.replace(`${cwd}/`, '');
}

export function normalizePaths(paths: string[], cwd: string) {
  return paths.map((path) => normalizePath(path, cwd));
}
