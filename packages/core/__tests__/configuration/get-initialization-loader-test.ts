import { CheckupConfigFormat } from '../../src';
import * as path from 'path';
import getInitializationConfigLoader from '../../src/configuration/loaders/get-initialization-loader';

describe('get-initialization-loader', () => {
  const defaultConfig = {
    plugins: [],
    tasks: {},
  };

  it('javascript config loader returns correct value', async () => {
    const loaderValue = await getInitializationConfigLoader('.', CheckupConfigFormat.JavaScript)();

    expect(loaderValue.format).toEqual(CheckupConfigFormat.JavaScript);
    expect(loaderValue.filepath).toEqual(path.join('.', '.checkuprc.js'));
    expect(loaderValue.config).toStrictEqual(defaultConfig);
  });

  it('json config loader returns correct value', async () => {
    const loaderValue = await getInitializationConfigLoader('.', CheckupConfigFormat.JSON)();

    expect(loaderValue.format).toEqual(CheckupConfigFormat.JSON);
    expect(loaderValue.filepath).toEqual(path.join('.', '.checkuprc'));
    expect(loaderValue.config).toStrictEqual(defaultConfig);
  });

  it('yaml config loader returns correct value', async () => {
    const loaderValue = await getInitializationConfigLoader('.', CheckupConfigFormat.YAML)();

    expect(loaderValue.format).toEqual(CheckupConfigFormat.YAML);
    expect(loaderValue.filepath).toEqual(path.join('.', '.checkuprc'));
    expect(loaderValue.config).toStrictEqual(defaultConfig);
  });
});
