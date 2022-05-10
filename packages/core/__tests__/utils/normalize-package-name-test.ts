import { getShorthandName, normalizePackageName } from '../../src/utils/normalize-package-name.js';

describe('normalize-package-name', () => {
  it.each([
    ['foo', 'checkup-plugin-foo'],
    ['checkup-plugin-foo', 'checkup-plugin-foo'],
    ['@z/foo', '@z/checkup-plugin-foo'],
    ['@z\\foo', '@z/checkup-plugin-foo'],
    ['@z\\foo\\bar.js', '@z/checkup-plugin-foo/bar.js'],
    ['@z/checkup-plugin', '@z/checkup-plugin'],
    ['@z/checkup-plugin-foo', '@z/checkup-plugin-foo'],
  ])('normalizes plugin name from %s to %s', (input, expected) => {
    let pluginName = normalizePackageName(input);
    expect(pluginName).toEqual(expected);
  });

  it.each([
    ['foo', 'checkup-formatter-foo'],
    ['checkup-formatter-foo', 'checkup-formatter-foo'],
    ['@z/foo', '@z/checkup-formatter-foo'],
    ['@z\\foo', '@z/checkup-formatter-foo'],
    ['@z\\foo\\bar.js', '@z/checkup-formatter-foo/bar.js'],
    ['@z/checkup-formatter', '@z/checkup-formatter'],
    ['@z/checkup-formatter-foo', '@z/checkup-formatter-foo'],
  ])('normalizes formatter name from %s to %s', (input, expected) => {
    let pluginName = normalizePackageName(input, 'checkup-formatter');
    expect(pluginName).toEqual(expected);
  });

  it.each([
    ['foo', 'foo'],
    ['checkup-plugin-foo', 'foo'],
    ['@z', '@z'],
    ['@z/checkup-plugin', '@z'],
    ['@z/foo', '@z/foo'],
    ['@z/checkup-plugin-foo', '@z/foo'],
  ])('gets short plugin name from %s to %s', (input, expected) => {
    let pluginName = getShorthandName(input);
    expect(pluginName).toEqual(expected);
  });
});
