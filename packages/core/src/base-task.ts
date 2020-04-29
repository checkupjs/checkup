import * as debug from 'debug';

import { TaskContext } from './types/tasks';

export default abstract class BaseTask {
  context: TaskContext;
  debug: debug.Debugger;

  constructor(context: TaskContext) {
    this.context = context;
    this.debug = debug('checkup:task');

    this.debug('%s %s', this.constructor.name, 'created');
  }
}
