import CheckupError from './checkup-error';
import { ErrorKind, ErrorDetailOptions } from './error-kind';

export type TaskErrorDetailOptions = ErrorDetailOptions & { taskName: string };

export default class TaskError extends CheckupError {
  constructor(options: TaskErrorDetailOptions) {
    super(ErrorKind.TaskError, options);
  }
}
