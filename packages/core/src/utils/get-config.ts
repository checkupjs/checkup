import { cosmiconfig } from 'cosmiconfig';
import { CheckupConfig } from '../types';

let config: CheckupConfig;
const DEFAULT_CONFIG: CheckupConfig = { plugins: [], tasks: {} };

/**
 * Get the checkup config via {@link cosmiconfig#search}
 * @return the parsed config file, if found, else the default config
 */
export async function getConfig(): Promise<CheckupConfig> {
  if (config !== undefined) {
    return config;
  }

  const configResult = await cosmiconfig('checkup').search();
  return (config = configResult?.config || DEFAULT_CONFIG);
}
