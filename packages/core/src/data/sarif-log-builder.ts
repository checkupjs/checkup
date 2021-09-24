import { Log, Run, ReportingDescriptor, Result, Invocation, Notification } from 'sarif';
import ow from 'ow';
import { RequiredResult, RequiredRun } from '../types/checkup-log';

export default class SarifLogBuilder {
  log: Log;
  runs: Run[];
  currentRunBuilder!: RunBuilder;
  rules: ReportingDescriptor[];
  results: Result[];

  constructor() {
    this.runs = [];
    this.rules = [];
    this.results = [];
    this.log = {
      version: '2.1.0',
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
      runs: this.runs,
    };
  }

  addRun(run: RunBuilder = new RunBuilder()) {
    this.currentRunBuilder = run;
    this.runs.push(run.run);
  }

  addRule(rule: ReportingDescriptor) {
    let ruleIndex = -1;
    let rules = this.currentRunBuilder.run.tool.driver.rules;

    ow(
      rule,
      ow.object.partialShape({
        id: ow.string,
      })
    );

    if (rules) {
      ruleIndex = rules.findIndex((r) => r.id === rule.id);

      if (ruleIndex !== -1) {
        return ruleIndex;
      }

      return rules.push(rule) - 1;
    }

    return ruleIndex;
  }

  hasRule(ruleId: string) {
    return this.rules.some((rule) => rule.id === ruleId);
  }

  addResult<TResult extends RequiredResult>(
    result: TResult,
    ruleMetadata?: Omit<ReportingDescriptor, 'id'>
  ) {
    ow(
      result,
      ow.object.partialShape({
        message: ow.object.hasKeys('text'),
        ruleId: ow.string,
        level: ow.string,
        kind: ow.string,
      })
    );

    const ruleIndex = this.addRule({
      id: result.ruleId,
      ...ruleMetadata,
    });

    if (ruleIndex !== -1) {
      result.ruleIndex = ruleIndex;
    }

    this.currentRunBuilder.run.results.push(result);
  }

  addInvocation(invocation: Invocation) {
    this.currentRunBuilder.currentInvocation = invocation;
    this.currentRunBuilder.run.invocations?.push(invocation);
  }

  addToolExecutionNotification(notification: Notification) {
    let notifications = this.currentRunBuilder.currentInvocation.toolExecutionNotifications;

    if (!notifications) {
      this.currentRunBuilder.currentInvocation.toolExecutionNotifications = notifications = [];
    }

    notifications.push(notification);
  }

  toJson() {
    return JSON.stringify(this.log, null, 2);
  }
}

class RunBuilder {
  run: RequiredRun;
  currentInvocation!: Invocation;

  constructor() {
    this.run = {
      tool: {
        driver: {
          name: 'checkup',
          language: 'en-US',
          informationUri: 'https://github.com/checkupjs/checkup',
          rules: [],
        },
      },
      results: [],
      invocations: [],
    };
  }
}
