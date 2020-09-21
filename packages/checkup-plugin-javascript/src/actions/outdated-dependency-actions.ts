import { ActionsEvaluator, toPercent, TaskConfig } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let totalDependencies = taskResults.reduce(
    (total, value) => total + (value.occurrenceCount || 0),
    0
  );
  let outdatedDependencies = {
    major:
      taskResults.find((taskResult) => taskResult.message.text === 'major')?.occurrenceCount || 0,
    minor:
      taskResults.find((taskResult) => taskResult.message.text === 'minor')?.occurrenceCount || 0,
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
