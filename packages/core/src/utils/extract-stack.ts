/**
 * Extracted from https://github.com/sindresorhus/extract-stack due to that package
 * using ESM. We're not using ESM yet, and using it caused issues with jest's test env.
 */
const stackRegex = /(?:\n {4}at .*)+/;

const extractStack = (error: Error | string) => {
  const stack = error instanceof Error ? error.stack : error;

  if (!stack) {
    return '';
  }

  const match = stack.match(stackRegex);

  if (!match) {
    return '';
  }

  return match[0].slice(1);
};

extractStack.lines = (stack: Error) =>
  extractStack(stack)
    .replace(/^ {4}at /gm, '')
    .split('\n');

export default extractStack;
