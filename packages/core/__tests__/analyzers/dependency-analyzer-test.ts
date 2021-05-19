import { resolve } from 'path';
import DependencyAnalyzer from '../../src/analyzers/dependency-analyzer';

describe('dependency-analyzer', () => {
  it('can load dependencies for a package.json', async () => {
    let packageJsonPath = resolve(__dirname, '..', '__fixtures__');
    let analyzer = new DependencyAnalyzer(packageJsonPath);

    let result = await analyzer.analyze();

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "installedVersion": "4.1.0",
          "latestVersion": "4.1.1",
          "packageName": "chalk",
          "packageVersion": "^4.0.0",
          "semverBump": "patch",
          "startColumn": 4,
          "startLine": 7,
          "type": "dependency",
          "wantedVersion": "4.1.1",
        },
        Object {
          "installedVersion": "3.1.1",
          "latestVersion": "3.1.1",
          "packageName": "ci-info",
          "packageVersion": "^3.1.1",
          "semverBump": null,
          "startColumn": 4,
          "startLine": 8,
          "type": "dependency",
          "wantedVersion": "3.1.1",
        },
        Object {
          "installedVersion": "4.3.1",
          "latestVersion": "4.3.1",
          "packageName": "debug",
          "packageVersion": "^4.3.1",
          "semverBump": null,
          "startColumn": 4,
          "startLine": 9,
          "type": "dependency",
          "wantedVersion": "4.3.2",
        },
        Object {
          "installedVersion": "9.1.0",
          "latestVersion": "10.0.0",
          "packageName": "fs-extra",
          "packageVersion": "^9.1.0",
          "semverBump": "major",
          "startColumn": 4,
          "startLine": 10,
          "type": "dependency",
          "wantedVersion": "9.1.0",
        },
        Object {
          "installedVersion": "11.0.3",
          "latestVersion": "11.0.3",
          "packageName": "globby",
          "packageVersion": "^11.0.1",
          "semverBump": null,
          "startColumn": 4,
          "startLine": 13,
          "type": "devDependency",
          "wantedVersion": "11.0.3",
        },
        Object {
          "installedVersion": "4.17.21",
          "latestVersion": "4.17.21",
          "packageName": "lodash",
          "packageVersion": "^4.17.21",
          "semverBump": null,
          "startColumn": 4,
          "startLine": 14,
          "type": "devDependency",
          "wantedVersion": "4.17.21",
        },
        Object {
          "installedVersion": "4.0.2",
          "latestVersion": "4.0.4",
          "packageName": "micromatch",
          "packageVersion": "^4.0.2",
          "semverBump": "patch",
          "startColumn": 4,
          "startLine": 15,
          "type": "devDependency",
          "wantedVersion": "4.0.4",
        },
        Object {
          "installedVersion": "1.19.0",
          "latestVersion": "1.20.0",
          "packageName": "resolve",
          "packageVersion": "^1.19.0",
          "semverBump": "minor",
          "startColumn": 4,
          "startLine": 16,
          "type": "devDependency",
          "wantedVersion": "1.20.0",
        },
      ]
    `);
  });
});
