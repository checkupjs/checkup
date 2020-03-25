type Severity = 0 | 1 | 2;

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
