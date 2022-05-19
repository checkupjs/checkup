import { FilePathArray } from '../../src/utils/file-path-array';

describe('FilePathsArray', function () {
  it('returns all files when no patterns are provided', function () {
    let files = new FilePathArray(...['foo.js', 'blue.hbs', 'goo.hbs']);

    expect(files.filterByGlob('**.js')).toMatchInlineSnapshot(`
[
  "foo.js",
]
`);
  });
});
