function isObject(e: unknown): e is Object {
  return e !== null && typeof e === 'object' && !Array.isArray(e);
}

export function isErrnoException(e: unknown): e is NodeJS.ErrnoException {
  return isObject(e) && 'code' in e;
}

export function isError(e: unknown): e is Error {
  return isObject(e) && 'message' in e;
}
