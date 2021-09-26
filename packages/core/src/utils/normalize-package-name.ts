/**
 * The below functions are referenced from eslint's plugin name normalization.
 * https://github.com/eslint/eslint/blob/bcafd0f8508e19ab8087a35fac7b97fc4295df3e/lib/shared/naming.js
 */

/**
 * Brings package name to correct format based on prefix
 *
 * @param {string} name - The name of the package.
 * @returns {string} Normalized name of the package
 * @private
 */
export function normalizePackageName(name: string, prefix = 'checkup-plugin') {
  let normalizedName = name;

  /**
   * On Windows, name can come in with Windows slashes instead of Unix slashes.
   * Normalize to Unix first to avoid errors later on.
   * https://github.com/eslint/eslint/issues/5644
   */
  if (normalizedName.includes('\\')) {
    normalizedName = normalizedName.replace(/\\/gu, '/');
  }

  if (normalizedName.charAt(0) === '@') {
    /**
     * it's a scoped package
     * package name is the prefix, or just a username
     */
    const scopedPackageShortcutRegex = new RegExp(`^(@[^/]+)(?:/(?:${prefix})?)?$`, 'u'),
      scopedPackageNameRegex = new RegExp(`^${prefix}(-|$)`, 'u');

    if (scopedPackageShortcutRegex.test(normalizedName)) {
      normalizedName = normalizedName.replace(scopedPackageShortcutRegex, `$1/${prefix}`);
    } else if (!scopedPackageNameRegex.test(normalizedName.split('/')[1])) {
      /**
       * for scoped packages, insert the prefix after the first / unless
       * the path is already @scope/eslint or @scope/eslint-xxx-yyy
       */
      normalizedName = normalizedName.replace(/^@([^/]+)\/(.*)$/u, `@$1/${prefix}-$2`);
    }
  } else if (!normalizedName.startsWith(`${prefix}-`)) {
    normalizedName = `${prefix}-${normalizedName}`;
  }

  return normalizedName;
}

/**
 * Removes the prefix from a fullName.
 *
 * @param {string} fullName The term which may have the prefix.
 * @returns {string} The term without prefix.
 */
export function getShorthandName(fullName: string, prefix = 'checkup-plugin') {
  if (fullName[0] === '@') {
    let matchResult = new RegExp(`^(@[^/]+)/${prefix}$`, 'u').exec(fullName);

    if (matchResult) {
      return matchResult[1];
    }

    matchResult = new RegExp(`^(@[^/]+)/${prefix}-(.+)$`, 'u').exec(fullName);
    if (matchResult) {
      return `${matchResult[1]}/${matchResult[2]}`;
    }
  } else if (fullName.startsWith(`${prefix}-`)) {
    return fullName.slice(prefix.length + 1);
  }

  return fullName;
}
