type Severity = 0 | 1 | 2;
type RuleLevel = Severity | 'off' | 'warn' | 'error';
type RuleLevelAndOptions<Options extends any[] = any[]> = Prepend<Partial<Options>, RuleLevel>;
type TemplateLintRuleDefinition = RuleLevel | RuleLevelAndOptions;
type TemplateLintPending = string | TemplateLintPendingWithExclusions;
type TemplateLintPlugin = string | TemplateLintPluginObject;

interface TemplateLintPluginObject {
  name: string;
  plugins: TemplateLintPlugin[];
  rules: {
    [ruleName: string]: TemplateLintRuleDefinition;
  };
  configurations: {
    [configuration: string]: TemplateLintConfig;
  };
}

interface TemplateLintOverride {
  files: string[];
  rule: {
    [ruleName: string]: RuleLevel | RuleLevelAndOptions;
  };
}

interface TemplateLintPendingWithExclusions {
  moduleId: string;
  only: string[];
}

export interface TemplateLintMessage {
  rule: string;
  severity: Severity;
  moduleId: string;
  message: string;
  line: number;
  column: number;
  source: string;
}

export interface TemplateLintResult {
  errorCount: number;
  filePath: string;
  messages: TemplateLintMessage[];
  source: string;
}

export interface TemplateLintReport {
  results: TemplateLintResult[];
  errorCount: number;
}

export interface TemplateLintConfig {
  extends?: string | string[];
  rules?: {
    [ruleName: string]: TemplateLintRuleDefinition;
  };
  pending?: TemplateLintPending[];
  ignore?: string[];
  plugins?: TemplateLintPlugin[];
  overrides?: TemplateLintOverride[];
}
