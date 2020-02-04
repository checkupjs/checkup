import * as fs from 'fs';

export default function getFileContents(filePath: string): string {
  return fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
}
