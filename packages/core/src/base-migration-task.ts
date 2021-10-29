import BaseTask from './base-task';
import { TaskContext, TaskResultOptions } from './types/tasks';

const merge = require('lodash.merge');

export type FeatureId = string;
export type Feature = {
  featureName: string;
  message: string;
  helpUri: string;
};

/**
 * Creates a new instance of a BaseMigrationTask.
 *
 * @param migrationName The short name of the migration. Used to format result messages.
 * @param pluginName The name of the plugin this task is included in.
 * @param context The runtime task context passed to the Task.
 */
export default abstract class BaseMigrationTask extends BaseTask {
  protected features: Map<FeatureId, Feature>;

  /**
   * A list of feature names that represent this migration.
   *
   * @readonly
   * @memberof BaseMigrationTask
   */
  get featureNames() {
    return [
      ...new Set(
        [...this.features.values()].map((ruleMetadata: Feature) => ruleMetadata.featureName)
      ),
    ];
  }

  /**
   * Creates a new instance of a migration Task.
   *
   * @param migrationName The short name of the migration. Used to format result messages.
   * @param pluginName The name of the plugin this task is included in.
   * @param context The runtime task context passed to the Task.
   */
  constructor(public migrationName: string, pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.features = new Map<FeatureId, Feature>();
  }

  /**
   * Adds componennt data to the rule metadata.
   */
  protected addRuleComponentMetadata() {
    this.addRule({
      properties: {
        component: {
          name: 'migration',
          options: {
            sortBy: 'value',
            sortDirection: 'desc',
          },
        },
      },
    });
  }

  /**
   * Adds a feature definition to the Checkup rule metadata. Used for correctly associating features and results.
   *
   * @param featureId - The ID of the feature, such as the lint rule ID corresponding to the feature
   * @param feature - An object representing the feature's details
   * @param feature.feature - The name of the feature
   * @param feature.message - The user-friendly message
   * @param feature.helpUri - A URL to provide help documentation about the feature
   */
  protected addFeature(featureId: FeatureId, feature: Feature) {
    this.features.set(featureId, feature);

    this.addRuleProperties({
      features: this.featureNames,
    });
  }

  /**
   * Adds a feature-specific result object to the Checkup output. The result includes the feature
   * metadata that this result is associated with in the migration.
   *
   * @param feature - An object representing the feature's details
   * @param feature.feature - The name of the feature
   * @param feature.message - The user-friendly message
   * @param feature.helpUri - A URL to provide help documentation about the feature
   * @param options Additional options to pass to the result
   * @param options.location Specifies a location where the result occurred
   * @param options.properties A property bag named properties, which stores additional values on the result
   */
  protected addFeatureResult(feature: Feature, options?: TaskResultOptions) {
    this.addResult(
      `${this.migrationName} | ${feature.featureName} : ${feature.message}. More info: ${feature.helpUri}`,
      'review',
      'warning',
      merge({}, options, {
        properties: {
          migration: {
            name: this.migrationName,
            featureName: feature.featureName,
          },
        },
      })
    );
  }
}
