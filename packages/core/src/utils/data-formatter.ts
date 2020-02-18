export function wrapEntries(
  data: Record<string, string>,
  schema: { keyName: string; valueName: string }
): object[] {
  let result = [];

  for (let key in data) {
    result.push({ [schema.keyName]: key, [schema.valueName]: data[key] });
  }

  return result;
}
