import BaseTask from './base-task';
import { TaskContext, TaskResultOptions } from './types/tasks';

const merge = require('lodash.merge');

export type FeatureId = string;
export type Feature = {
  featureName: string;
  message: string;
  helpUri: string;
};

export default abstract class BaseMigrationTask extends BaseTask {
  features: Map<FeatureId, Feature>;

  get featureNames() {
    return [
      ...new Set(
        [...this.features.values()].map((ruleMetadata: Feature) => ruleMetadata.featureName)
      ),
    ];
  }

  constructor(public migrationName: string, pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.features = new Map<FeatureId, Feature>();
  }

  /**
   *
   * @param id - The ID of the feature, such as the lint rule ID corresponding to the feature
   * @param feature - An object representing the feature's details
   * @param feature.feature - The name of the feature
   * @param feature.message - The user-friendly message
   * @param feature.helpUri - A URL to provide help documentation about the feature
   */
  addFeature(id: FeatureId, feature: Feature) {
    this.features.set(id, feature);

    this.addRuleProperties({
      features: this.featureNames,
    });
  }

  /**
   *
   * @param feature - An object representing the feature's details
   * @param feature.feature - The name of the feature
   * @param feature.message - The user-friendly message
   * @param feature.helpUri - A URL to provide help documentation about the feature
   * @param options Additional options to pass to the result
   * @param options.location Specifies a location where the result occurred
   * @param options.properties A property bag named properties, which stores additional values on the result
   */
  addFeatureResult(feature: Feature, options?: TaskResultOptions) {
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
