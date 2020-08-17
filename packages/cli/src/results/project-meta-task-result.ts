import { MetaTaskResult } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { CheckupResult } from '@checkup/core';
import { JsonObject } from 'type-fest';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  data!: CheckupResult['info'];

  toJson() {
    return this.data as JsonObject;
  }
}
