import { ReportingDescriptor } from 'sarif';

export function getOptions<T>(rule: ReportingDescriptor): T {
  return rule.properties?.component.options ?? {};
}
