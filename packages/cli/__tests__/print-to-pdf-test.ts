import { join, resolve } from 'path';

import { createTmpDir } from '@checkup/test-helpers';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { printToPDF } from '../src/helpers/print-to-pdf';

describe('print-to-pdf', () => {
  it('prints dummy file to PDF', async () => {
    let tmp = createTmpDir();
    let outputFilePath = join(tmp, 'tmp-report.pdf');
    let htmlPath = resolve('./__fixtures__/report.html');
    await printToPDF(pathToFileURL(htmlPath).toString(), outputFilePath);

    expect(existsSync(outputFilePath)).toEqual(true);
  }, 100000);
});
