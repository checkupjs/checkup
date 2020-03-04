import { CheckupConfig, CheckupConfigFormat, CheckupConfigService } from '../../src';
import CheckupFixturifyProject from '@checkup/test-helpers/lib/checkup-fixturify-project';
import * as path from 'path';
import * as fs from 'fs';

describe('checkup-config-service', () => {
  let defaultConfig: CheckupConfig;

  beforeEach(() => {
    defaultConfig = {
      plugins: [],
      tasks: {},
    };
  });

  it('should load a config via a loader', async () => {
    const configService = await CheckupConfigService.load(async () => ({
      filepath: '.',
      config: defaultConfig,
      format: CheckupConfigFormat.JSON,
    }));

    expect(configService.get()).toStrictEqual(defaultConfig);
  });

  it('should throw an error if an invalid config is present and get is called', async () => {
    const configService = await CheckupConfigService.load(async () => ({
      filepath: '.',
      config: ({
        plugins: {},
        tasks: {
          someTask: 'foo',
        },
      } as unknown) as CheckupConfig,
      format: CheckupConfigFormat.JSON,
    }));

    expect(() => configService.get()).toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if an invalid config is present and write is called', async () => {
    const configService = await CheckupConfigService.load(async () => ({
      filepath: '.',
      config: ({
        plugins: {},
        tasks: {
          someTask: 'foo',
        },
      } as unknown) as CheckupConfig,
      format: CheckupConfigFormat.JSON,
    }));

    expect(() => configService.write()).toThrowErrorMatchingSnapshot();
  });

  it('should map a config given a set of mappers', async () => {
    const config = (
      await CheckupConfigService.load(async () => ({
        filepath: '.',
        config: defaultConfig,
        format: CheckupConfigFormat.JSON,
      }))
    )
      .map(
        ...[
          (config: CheckupConfig) => {
            config.plugins.push('plugin-foo');
            return config;
          },
          (config: CheckupConfig) => {
            config.tasks.bar = {
              isEnabled: false,
            };
            return config;
          },
        ]
      )
      .get();

    expect(config.plugins).toStrictEqual(['plugin-foo']);
    expect(config.tasks).toStrictEqual({
      bar: {
        isEnabled: false,
      },
    });
  });

  it.each(Object.keys(CheckupConfigFormat).map(format => [format]))(
    'should write the config applying the given mappers on calling write for %s files',
    async format => {
      const project = new CheckupFixturifyProject('test');
      const filepath = path.join(project.baseDir, '.checkuprc');
      project.writeSync();
      (
        await CheckupConfigService.load(async () => ({
          filepath: path.join(project.baseDir, '.checkuprc'),
          config: defaultConfig,
          format: format as CheckupConfigFormat,
        }))
      )
        .map(
          ...[
            (config: CheckupConfig) => {
              config.plugins.push('plugin-foo');
              return config;
            },
            (config: CheckupConfig) => {
              config.tasks.bar = {
                isEnabled: false,
              };
              return config;
            },
          ]
        )
        .write();

      expect(fs.readFileSync(filepath, 'utf8')).toMatchSnapshot();
      project.dispose();
    }
  );
});
