import Project from 'fixturify-project';

export default class CheckupPluginProject extends Project {
  constructor(
    name: string,
    version?: string | undefined,
    cb?: ((project: Project) => void) | undefined,
    root?: string | undefined
  ) {
    super(name, version, cb, root);

    this.pkg.keywords = ['oclif-plugin'];
    this.files = {
      __tests__: {},
      src: {
        hooks: {
          'register-tasks.ts': `import { Hook } from '@oclif/config';

const hook: Hook<'register-tasks'> = async function({ cliArguments, tasks }: any) {

};

export default hook;
`,
          'register-tasks.js': `import { Hook } from '@oclif/config';

const hook = async function({ cliArguments, tasks }) {

};

export default hook;
`,
        },
        results: {},
        tasks: {
          'index.ts': '',
          'index.js': '',
        },
      },
    };
  }
}
