import * as debug from 'debug';

export default abstract class BaseTask {
  args: any;
  debug: debug.Debugger;

  constructor(cliArguments: any) {
    this.args = cliArguments;
    this.debug = debug('checkup:task');

    this.debug('%s %s', this.constructor.name, 'created');
  }
}
