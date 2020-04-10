import { ReportResultData, ReportComponentType } from '@checkup/core';
import { readFileSync } from 'fs-extra';
import * as Handlebars from 'handlebars';
import * as path from 'path';

export type CompiledPartials = {
  [key in ReportComponentType]: HandlebarsTemplateDelegate;
};

const COMPILED_PARTIALS: CompiledPartials = {
  [ReportComponentType.NumericalCard]: getPartialDelegate('numerical-card.hbs'),
  [ReportComponentType.Table]: getPartialDelegate('table.hbs'),
  [ReportComponentType.GradedTable]: getPartialDelegate('graded-table.hbs'),
  [ReportComponentType.PieChart]: getPartialDelegate('pie-chart.hbs'),
};

/*
 * When testing partials rendering multiple times in the same module,
 * it is efficient to compile them once in module scope and pass the precompiled
 * partials to the `renderPartialAsHtml` function
 **/
export function getPartialDelegate(partialPath: string): HandlebarsTemplateDelegate {
  let fullPartialPath = path.join(__dirname, `../../src/static/components/${partialPath}`);
  let partialRaw = readFileSync(fullPartialPath, 'utf8');
  return Handlebars.compile(partialRaw);
}

export function renderPartialAsHtml(componentData: ReportResultData): string {
  // TODO: remove this check once all tasks are retrofitted to return results (and undefined  is no longer a valid option for ReportResultsData)
  if (componentData) {
    return COMPILED_PARTIALS[componentData.componentType]({ taskResult: componentData });
  }
  return '';
}
