import CheckupError from './checkup-error.js';
import { ErrorKind, ErrorDetailOptions } from './error-kind.js';

export type TaskErrorDetailOptions = ErrorDetailOptions & { taskName: string };

/**
 * A custom error class that outputs Task specific error information.
 *
 * @export
 * @class TaskError
 * @extends {CheckupError}
 */
export default class TaskError extends CheckupError {
  constructor(options: TaskErrorDetailOptions) {
    super(ErrorKind.TaskError, options);
  }
}
