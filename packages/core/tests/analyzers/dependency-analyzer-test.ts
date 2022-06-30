import { resolve } from 'path';
import { dirname } from '@checkup/core';
import DependencyAnalyzer from '../../src/analyzers/dependency-analyzer';

describe('dependency-analyzer', () => {
  it('can load dependencies for a package.json', async () => {
    let packageJsonPath = resolve(dirname(import.meta), '..', '__fixtures__');
    let analyzer = new DependencyAnalyzer(packageJsonPath);
    let result = await analyzer.analyze();

    expect(result).toContainEqual(
      expect.objectContaining({
        installedVersion: expect.any(String),
        latestVersion: expect.any(String),
        packageName: expect.any(String),
        packageVersion: expect.any(String),
        semverBump: expect.any(String),
        startColumn: expect.any(Number),
        startLine: expect.any(Number),
        type: expect.any(String),
        wantedVersion: expect.any(String),
      })
    );

    expect(result).toHaveLength(8);
  });
});
