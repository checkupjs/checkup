const micromatch = require('micromatch');

export class FilePathsArray extends Array<string> {
  filterByGlob(glob: string | string[]) {
    return micromatch(this, glob);
  }
}
