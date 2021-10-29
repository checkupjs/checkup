import BaseTask from './base-task';
import { TaskContext, TaskResultOptions } from './types/tasks';

type ValidationResult = {
  isValid: boolean;
  options?: TaskResultOptions;
};

export default abstract class BaseValidationTask extends BaseTask {
  validationSteps: Map<string, () => ValidationResult>;

  /**
   * Creates a new instance of a validation Task.
   *
   * @param pluginName The name of the plugin this task is included in.
   * @param context The runtime task context passed to the Task.
   */
  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.validationSteps = new Map();
  }

  /**
   * Adds componennt data to the rule metadata.
   */
  protected addRuleComponentMetadata() {
    this.addRule({
      properties: {
        component: {
          name: 'validation',
        },
      },
    });
  }

  /**
   * Adds a validation step to be run during this class' validate method.
   *
   * @param messageText A non-empty string containing a plain text message
   * @param validate A function to run that returns a {ValidationResult} indicating whether the validation was successful.
   */
  protected addValidationStep(messageText: string, validate: () => ValidationResult) {
    this.validationSteps.set(messageText, validate);
  }

  /**
   * Validates each step added by addValidationStep.
   *
   * @returns A map of messages and ValidationResult objects
   */
  validate() {
    let results = new Map<string, ValidationResult>();

    for (let [messageText, validate] of this.validationSteps) {
      results.set(messageText, validate());
    }

    return results;
  }

  /**
   * Adds a validation-specific result object to the Checkup output.  '
   *
   * @param messageText A non-empty string containing a plain text message
   * @param isValid - A boolean indicating whether the validation step is valid.
   * @param options Additional options to pass to the result
   * @param options.location Specifies a location where the result occurred
   * @param options.properties A property bag named properties, which stores additional values on the result   */
  protected addValidationResult(
    messageText: string,
    isValid: boolean,
    options?: TaskResultOptions
  ) {
    this.addResult(messageText, isValid ? 'pass' : 'fail', isValid ? 'none' : 'error', options);
  }
}
