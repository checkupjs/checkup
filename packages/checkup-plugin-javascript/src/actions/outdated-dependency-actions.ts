import { ActionsEvaluator, toPercent, TaskResult, TaskConfig } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult, taskConfig: TaskConfig) {
  let { values: dependenciesCount, total: totalDependencies } = taskResult.result[0].dataSummary;
  let outdatedCount = Object.values<number>(dependenciesCount).reduce(
    (total: number, count: number) => total + count,
    0
  );
  let actionsEvaluator = new ActionsEvaluator();

  actionsEvaluator.add({
    name: 'reduce-outdated-major-dependencies',
    summary: 'Update outdated major versions',
    details: `${dependenciesCount.major} major versions outdated`,
    defaultThreshold: 0.05,
    items: [],
    input: dependenciesCount.major / totalDependencies,
  });
  actionsEvaluator.add({
    name: 'reduce-outdated-minor-dependencies',
    summary: 'Update outdated minor versions',
    details: `${dependenciesCount.minor} minor versions outdated`,
    defaultThreshold: 0.05,
    items: [],
    input: dependenciesCount.minor / totalDependencies,
  });
  actionsEvaluator.add({
    name: 'reduce-outdated-dependencies',
    summary: 'Update outdated versions',
    details: `${toPercent(outdatedCount / totalDependencies)} of versions outdated`,
    defaultThreshold: 0.2,
    items: [],
    input: outdatedCount / totalDependencies,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
