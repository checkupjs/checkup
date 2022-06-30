import { Result } from 'sarif';

export function getMockResult(
  taskName: string,
  category: string,
  group: string = '',
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  result: Result = { message: { text: 'hey' } }
): Result {
  result.properties = {
    ...result.properties,
    taskName: taskName,
    taskDisplayName: taskName,
    category: category,
    group: group,
  };
  return result;
}
