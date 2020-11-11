import { ActionsEvaluator, toPercent, TaskConfig, sumOccurrences } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let totalDependencies = sumOccurrences(taskResults);

  let outdatedDependencies = {
    major: sumOccurrences(taskResults.filter((taskResult) => taskResult.message.text === 'major')),
    minor: sumOccurrences(taskResults.filter((taskResult) => taskResult.message.text === 'minor')),
  };

  let actionsEvaluator = new ActionsEvaluator();

  actionsEvaluator.add({
    name: 'reduce-outdated-major-dependencies',
    summary: 'Update outdated major versions',
    details: `${outdatedDependencies.major} major versions outdated`,
    defaultThreshold: 0.05,
    items: [],
    input: outdatedDependencies.major / totalDependencies,
  });
  actionsEvaluator.add({
    name: 'reduce-outdated-minor-dependencies',
    summary: 'Update outdated minor versions',
    details: `${outdatedDependencies.minor} minor versions outdated`,
    defaultThreshold: 0.05,
    items: [],
    input: outdatedDependencies.minor / totalDependencies,
  });
  actionsEvaluator.add({
    name: 'reduce-outdated-dependencies',
    summary: 'Update outdated versions',
    details: `${toPercent(
      (outdatedDependencies.major + outdatedDependencies.minor) / totalDependencies
    )} of versions outdated`,
    defaultThreshold: 0.2,
    items: [],
    input: (outdatedDependencies.major + outdatedDependencies.minor) / totalDependencies,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
