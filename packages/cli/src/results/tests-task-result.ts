import { ITaskResult, TestType } from '../types';

import { Node } from '@babel/traverse';
import { TestTraverserFileResult } from '../tasks/tests-task';
import { ui } from '../utils/ui';

type TestFile = {
  filePath: string;
  modules: Node[];
  skips: Node[];
  tests: Node[];
};

function getTestMetricsFromVerbose(files: TestFile[]) {
  return files.reduce(
    (metrics, file) => {
      return {
        moduleCount: metrics.moduleCount + file.modules.length,
        skipCount: metrics.skipCount + file.skips.length,
        testCount: metrics.testCount + file.tests.length,
      };
    },
    { moduleCount: 0, skipCount: 0, testCount: 0 }
  );
}

export default class TestsTaskResult implements ITaskResult {
  private _verbose: {
    [TestType.Application]: TestFile[];
    [TestType.Container]: TestFile[];
    [TestType.Rendering]: TestFile[];
    [TestType.Unit]: TestFile[];
  } = {
    [TestType.Application]: [],
    [TestType.Container]: [],
    [TestType.Rendering]: [],
    [TestType.Unit]: [],
  };

  get basic() {
    return {
      [TestType.Application]: getTestMetricsFromVerbose(this._verbose[TestType.Application]),
      [TestType.Container]: getTestMetricsFromVerbose(this._verbose[TestType.Container]),
      [TestType.Rendering]: getTestMetricsFromVerbose(this._verbose[TestType.Rendering]),
      [TestType.Unit]: getTestMetricsFromVerbose(this._verbose[TestType.Unit]),
    };
  }

  get verbose() {
    return this._verbose;
  }

  transformAndLoadResults(results: Map<string, TestTraverserFileResult>) {
    for (const [filePath, { type, invocationMap }] of results.entries()) {
      if (this._verbose[type]) {
        this._verbose[type].push({
          filePath,
          modules: invocationMap.get('module') || [],
          skips: invocationMap.get('skip') || [],
          tests: invocationMap.get('test') || [],
        });
      }
    }
  }

  toConsole() {
    ui.styledHeader('Test Types');
    ui.blankLine();
  }

  toJson() {
    return { tests: this.basic };
  }
}
