import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { pathToFileURL } from 'url';
import { printToPDF } from './print-to-pdf';
import { readFileSync } from 'fs-extra';
import { ReportComponentType, UIReportData } from '@checkup/core';

import tmp = require('tmp');

const date = require('date-and-time');

/**
 * @param jsonResult
 * @param results
 */
export async function generateReport(
  resultOutputPath: string,
  resultsForPdf: UIReportData
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

export function generateHTML(resultsForPdf: UIReportData) {
  const reportPath = path.join(__dirname, '../../static/report-template.hbs');
  const reportTemplateRaw = requiresChart(resultsForPdf)
    ? appendChartjsCssSourceFiles(readFileSync(reportPath, 'utf8'))
    : readFileSync(reportPath, 'utf8');
  registerPartials();
  const template = Handlebars.compile(reportTemplateRaw);
  return template(resultsForPdf);
}

function registerPartials() {
  const partials = [
    { path: 'numerical-card.hbs', type: ReportComponentType.NumericalCard },
    { path: 'table.hbs', type: ReportComponentType.Table },
    { path: 'pie-chart.hbs', type: ReportComponentType.PieChart },
  ];

  partials.forEach((partial) => {
    const fullPartialPath = path.join(__dirname, `../../static/components/${partial.path}`);
    const partialTemplateRaw =
      partial.type === ReportComponentType.PieChart
        ? appendChartjsJsSourceFiles(readFileSync(fullPartialPath, 'utf8'))
        : readFileSync(fullPartialPath, 'utf8');
    Handlebars.registerPartial(partial.type, partialTemplateRaw);
  });
}

function requiresChart(resultsForPdf: any): boolean {
  return resultsForPdf.requiresChart;
}

function appendChartjsCssSourceFiles(reportTemplateRaw: string): string {
  const CHART_CSS = readFileSync(
    path.join(__dirname, '../../static/external-libraries/chart-bootstrap.css'),
    'utf8'
  );
  return reportTemplateRaw
    .toString()
    .replace('{{!-- CHECKUP-CHART-BOOTSTRAP.CSS --}}', `<style>${CHART_CSS}</style>`);
}

function appendChartjsJsSourceFiles(reportTemplateRaw: string): string {
  const CHART_JS = readFileSync(
    path.join(__dirname, '../../static/external-libraries/chartjs-2.9.3.min.js'),
    'utf8'
  );

  return reportTemplateRaw
    .toString()
    .replace('{{!-- CHECKUP-CHART-JS --}}', `<script>${CHART_JS}</script>`);
}
