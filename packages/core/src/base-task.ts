import * as debug from 'debug';

import { TaskContext, TaskIdentifier, TaskMetaData } from './types/tasks';

export default abstract class BaseTask {
  context: TaskContext;
  meta!: TaskMetaData | TaskIdentifier;
  debug: debug.Debugger;
  private _options!: boolean | object;

  constructor(context: TaskContext) {
    this.context = context;
    this.debug = debug('checkup:task');

    this.debug('%s %s', this.constructor.name, 'created');
  }

  get enabled() {
    let options = this.context.config.tasks[this.meta.taskName];

    return typeof options === 'undefined' || typeof options === 'object' || options;
  }

  get options() {
    let options = this.context.config.tasks[this.meta.taskName];

    return typeof options === 'object' ? options : {};
  }
}
