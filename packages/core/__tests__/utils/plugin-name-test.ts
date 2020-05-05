import { getShorthandName, normalizePackageName } from '../../src/utils/plugin-name';

describe('plugin-name', () => {
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
