import { MetaTaskResult } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { CheckupMetadata } from '@checkup/core';
import { JsonObject } from 'type-fest';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  data!: CheckupMetadata;

  toJson() {
    return (this.data as unknown) as JsonObject;
  }
}
