'use strict';

import { FilePathsArray } from '../../src/utils/file-paths-array';

describe('FilePathsArray', function () {
  it('returns all files when no patterns are provided', function () {
    let files = new FilePathsArray(...['foo.js', 'blue.hbs', 'goo.hbs']);

    expect(files.filterByGlob('**.js')).toMatchInlineSnapshot(`
      Array [
        "foo.js",
      ]
    `);
  });
});
