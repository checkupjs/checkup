import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { ReportComponentType } from '@checkup/core';
import { pathToFileURL } from 'url';
import { printToPDF } from './print-to-pdf';
import { readFileSync } from 'fs-extra';

import tmp = require('tmp');

const date = require('date-and-time');

/**
 * @param jsonResult
 * @param results
 */
export async function generateReport(
  resultOutputPath: string,
  resultsForPdf: any
): Promise<string> {
  let reportHTML = generateHTML(resultsForPdf);

  let tmpDir = fs.realpathSync(tmp.dirSync({ unsafeCleanup: true }).name);
  let htmlTmpPath = path.resolve(path.join(tmpDir, 'tmp-report.html'));
  fs.writeFileSync(htmlTmpPath, reportHTML);

  if (!fs.existsSync(resultOutputPath)) {
    fs.mkdirSync(resultOutputPath, { recursive: true });
  }

  let outputFilePath = path.resolve(
    path.join(
      resultOutputPath,
      `checkup-report-${date.format(new Date(), 'YYYY-MM-DD-HH-mm-ss')}.pdf`
    )
  );

  await printToPDF(pathToFileURL(htmlTmpPath).toString(), outputFilePath);

  return outputFilePath;
}

export function generateHTML(resultsForPdf: any) {
  const reportPath = path.join(__dirname, '../../static/report-template.hbs');
  const reportTemplateRaw = readFileSync(reportPath, 'utf8');

  const template = Handlebars.compile(reportTemplateRaw);
  registerPartials();
  return template(resultsForPdf);
}

function registerPartials() {
  const partials = [
    { path: 'numerical-card.hbs', type: ReportComponentType.NumericalCard },
    { path: 'table.hbs', type: ReportComponentType.Table },
    { path: 'graded-table.hbs', type: ReportComponentType.GradedTable },
    { path: 'pie-chart.hbs', type: ReportComponentType.PieChart },
  ];

  partials.forEach((partial) => {
    const fullPartialPath = path.join(__dirname, `../../static/components/${partial.path}`);
    const partialTemplateRaw = readFileSync(fullPartialPath, 'utf8');
    Handlebars.registerPartial(partial.type, partialTemplateRaw);
  });
}
