import {
  Log,
  Run,
  ReportingDescriptor,
  Result,
  Address,
  Artifact,
  ArtifactLocation,
  Conversion,
  ExternalPropertyFileReferences,
  Graph,
  Invocation,
  LogicalLocation,
  Notification,
  PropertyBag,
  RunAutomationDetails,
  SpecialLocations,
  ThreadFlowLocation,
  Tool,
  ToolComponent,
  VersionControlDetails,
  WebRequest,
  WebResponse,
} from 'sarif';
import ow from 'ow';
import { SetRequired } from 'type-fest';

type RequiredRun = SetRequired<Run, 'tool' | 'results'>;
type RequiredResult = SetRequired<Result, 'message' | 'ruleId' | 'kind' | 'level'>;

export default class SarifLogBuilder {
  log: Log;
  runs: Run[];
  currentRun!: RunBuilder;
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

    // A sarifLog object SHALL contain a property named runs (§3.13.4)
    this.addRun();
  }

  addRun(run: RunBuilder = new RunBuilder()) {
    this.currentRun = run;
    this.runs.push(run);
  }

  addRule(rule: ReportingDescriptor) {
    let ruleIndex = -1;
    let rules = this.currentRun.tool.driver.rules;

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

    this.currentRun.results.push(result);
  }

  addInvocation(invocation: Invocation) {
    this.currentRun.currentInvocation = invocation;
    this.currentRun.invocations?.push(invocation);
  }

  addToolExecutionNotification(notification: Notification) {
    let notifications = this.currentRun.currentInvocation.toolExecutionNotifications;

    if (!notifications) {
      this.currentRun.currentInvocation.toolExecutionNotifications = notifications = [];
    }

    notifications.push(notification);
  }

  toJson() {
    return JSON.stringify(this.log, null, 2);
  }
}

class RunBuilder implements RequiredRun {
  addresses?: Address[] | undefined;
  artifacts?: Artifact[] | undefined;
  automationDetails?: RunAutomationDetails | undefined;
  baselineGuid?: string | undefined;
  columnKind?: Run.columnKind | undefined;
  conversion?: Conversion | undefined;
  defaultEncoding?: string | undefined;
  defaultSourceLanguage?: string | undefined;
  externalPropertyFileReferences?: ExternalPropertyFileReferences | undefined;
  graphs?: Graph[] | undefined;
  invocations?: Invocation[] | undefined;
  language?: string | undefined;
  logicalLocations?: LogicalLocation[] | undefined;
  newlineSequences?: string[] | undefined;
  originalUriBaseIds?: { [key: string]: ArtifactLocation } | undefined;
  policies?: ToolComponent[] | undefined;
  redactionTokens?: string[] | undefined;
  results: Result[] = [];
  runAggregates?: RunAutomationDetails[] | undefined;
  specialLocations?: SpecialLocations | undefined;
  taxonomies?: ToolComponent[] | undefined;
  tool: Tool;
  threadFlowLocations?: ThreadFlowLocation[] | undefined;
  translations?: ToolComponent[] | undefined;
  versionControlProvenance?: VersionControlDetails[] | undefined;
  webRequests?: WebRequest[] | undefined;
  webResponses?: WebResponse[] | undefined;
  properties?: PropertyBag | undefined;

  currentInvocation!: Invocation;

  constructor() {
    this.tool = {
      driver: {
        name: 'checkup',
        language: 'en-US',
        informationUri: 'https://github.com/checkupjs/checkup',
        rules: [],
      },
    };

    this.invocations = [];
  }
}
