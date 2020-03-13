import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { pathToFileURL } from 'url';
import { printToPDF } from './print-to-pdf';
import { readFileSync } from 'fs-extra';

import tmp = require('tmp');

const date = require('date-and-time');
const REPORT_PATH = path.join(__dirname, '../static/report-template.hbs');
const CARD_PATH = path.join(__dirname, '../static/components/card.hbs');

let REPORT_TEMPLATE_RAW = readFileSync(REPORT_PATH, 'utf8');
let CARD_TEMPLATE_RAW = readFileSync(CARD_PATH, 'utf8');
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
  const template = Handlebars.compile(REPORT_TEMPLATE_RAW);
  Handlebars.registerPartial('cardPartial', CARD_TEMPLATE_RAW);
  return template(resultsForPdf);
}
