import { stdout as pso } from 'stdout-stderr';

beforeEach(() => {
  pso.start();
});

afterEach(() => {
  pso.stop();
});

export function stdout() {
  return pso.output;
}
