import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { JsonObject } from 'type-fest';
import { pathToFileURL } from 'url';
import { printToPDF } from './print-to-pdf';
import { readFileSync } from 'fs-extra';

import tmp = require('tmp');

const date = require('date-and-time');
const REPORT_PATH = path.join(__dirname, '../static/report-template.hbs');

let REPORT_TEMPLATE_RAW = readFileSync(REPORT_PATH, 'utf8');
/**
 * @param jsonResult
 * @param results
 */
export async function generateReport(
  resultOutputPath: string,
  jsonResult: JsonObject
): Promise<string> {
  const template = Handlebars.compile(REPORT_TEMPLATE_RAW);
  let tmpDir = fs.realpathSync(tmp.dirSync({ unsafeCleanup: true }).name);
  let htmlTmpPath = path.resolve(path.join(tmpDir, 'tmp-report.html'));

  let reportHTML = template(jsonResult);

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
