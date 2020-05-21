import { stdout as pso } from 'stdout-stderr';

beforeEach(() => {
  pso.start();
});

afterEach(() => {
  pso.stop();
});

/**
 * Uses jest's beforeEach/afterEach to setup/teardown capturing
 * process.stdout in order to use for assertions.
 *
 * @export
 * @returns
 */
export function stdout() {
  return pso.output;
}

export function clearStdout() {
  pso.stop();
  pso.start();
}
