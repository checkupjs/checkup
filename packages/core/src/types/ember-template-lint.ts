type Severity = 0 | 1 | 2;

type RuleLevel = Severity | 'off' | 'warn' | 'error';

type RuleLevelAndOptions<Options extends any[] = any[]> = Prepend<Partial<Options>, RuleLevel>;

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
    [name: string]: RuleLevel | RuleLevelAndOptions;
  };
  pending?: string[];
  ignore?: string[];
  plugins?: string[];
  overrides?: string[];
}
