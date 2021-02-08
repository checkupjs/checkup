export function trimCwd(path: string, cwd: string) {
  return path.replace(`${cwd}/`, '');
}

export function trimAllCwd(paths: string[], cwd: string) {
  return paths.map((path) => trimCwd(path, cwd));
}
