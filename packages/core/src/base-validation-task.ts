import BaseTask from './base-task';
import { TaskContext } from './types/tasks';

export default abstract class BaseValidationTask extends BaseTask {
  private validationSteps: Map<string, () => boolean>;

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.validationSteps = new Map();
  }

  protected addValidationStep(description: string, validate: () => boolean) {
    this.validationSteps.set(description, validate);
  }

  protected validate() {
    let results = new Map<string, boolean>();

    for (let [description, validate] of this.validationSteps) {
      results.set(description, validate());
    }

    return results;
  }
}
