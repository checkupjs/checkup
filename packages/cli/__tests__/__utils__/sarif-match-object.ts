export const sarifLogMatcher = {
  $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
  properties: {
    actions: [],
    analyzedFiles: expect.any(Array),
    analyzedFilesCount: expect.any(Number),
    cli: {
      args: expect.any(Array),
      config: {
        $schema:
          'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json',
        excludePaths: [],
        plugins: [],
        tasks: {},
      },
      configHash: expect.any(String),
      flags: expect.any(Object),
      schema: 1,
      version: '0.0.0',
    },
    project: {
      name: 'checkup-app',
      repository: {
        activeDays: '0 days',
        age: '0 days',
        linesOfCode: {
          total: expect.any(Number),
          types: expect.any(Array),
        },
        totalCommits: expect.any(Number),
        totalFiles: expect.any(Number),
      },
      version: '0.0.0',
    },
    timings: {},
  },
  runs: [
    {
      invocations: [
        {
          arguments: expect.any(Array),
          endTimeUtc: expect.any(String),
          environmentVariables: {
            cwd: expect.any(String),
            format: expect.stringMatching(/stdout|json/),
            outputFile: '',
          },
          executionSuccessful: true,
          startTimeUtc: expect.any(String),
          toolExecutionNotifications: [],
        },
      ],
      results: expect.any(Array),
      tool: {
        driver: {
          informationUri: 'https://github.com/checkupjs/checkup',
          language: 'en-US',
          name: 'Checkup',
          rules: expect.any(Array),
          version: '0.0.0',
        },
      },
    },
  ],
  version: '2.1.0',
};
