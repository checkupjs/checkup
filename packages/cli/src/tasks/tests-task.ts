import { ISearchTraverser, ITask, TestType } from '../types';
import { Node, NodePath } from '@babel/traverse';

import AstSearcher from '../searchers/ast-searcher';
import { BASE_DIR } from '../utils/project';
import JavaScriptTraverser from '../traversers/javascript-traverser';
import { TestsTaskResult } from '../results';

export type TestTraverserFileResult = {
  type: TestType;
  invocationMap: Map<string, Node[]>;
};

const TEST_TYPE_MAP = {
  setupApplicationTest: TestType.Application,
  setupRenderingTest: TestType.Rendering,
  setupTest: TestType.Container,
};

const INVOCATIONS = ['test', 'module', 'skip'];

class TestTraverser extends JavaScriptTraverser
  implements ISearchTraverser<TestTraverserFileResult> {
  _results: Map<string, Node[]>;
  _testType: TestType;

  constructor() {
    super();

    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get hasResults(): boolean {
    return !!this._results.size;
  }

  reset() {
    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get results(): TestTraverserFileResult {
    return {
      type: this._testType,
      invocationMap: this._results,
    };
  }

  get visitors() {
    return {
      Identifier: (path: NodePath) => {
        const pathNodeName: string = path.node.type === 'Identifier' ? path.node.name : '';

        // Identify Type
        if (
          (pathNodeName === 'setupApplicationTest' ||
            pathNodeName === 'setupRenderingTest' ||
            pathNodeName === 'setupTest') &&
          path.parent.type === 'CallExpression'
        ) {
          this._testType = TEST_TYPE_MAP[pathNodeName];
        }

        // Measure metrics
        if (INVOCATIONS.includes(pathNodeName) && path.parent.type === 'CallExpression') {
          let nodes = this._results.get(pathNodeName) || [];

          if (nodes.length === 0) {
            this._results.set(pathNodeName, nodes);
          }

          nodes.push(path.node);
        }
      },
    };
  }
}

export default class TestsTask implements ITask {
  /**
   * Returns the Node count of the individual test metrics from the ast search result.
   * Possible Metrics - moduleCount, skipCount, testCount
   * @param invocationMap
   * @param metricType
   */
  getTestMetricCount(invocationMap: Map<string, Node[]>, metricType: string) {
    const metricValue = invocationMap.get(metricType);
    return metricValue ? metricValue.length : 0;
  }

  async run(): Promise<TestsTaskResult> {
    let astSearcher = new AstSearcher(BASE_DIR, ['**/tests/**/*.js']);

    const testVisitor = new TestTraverser();
    const testResults = await astSearcher.search(testVisitor);

    const result = new TestsTaskResult();
    result.transformAndLoadResults(testResults);

    return result;
  }
}
