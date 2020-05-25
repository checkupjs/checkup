import { stderr as pse, stdout as pso } from 'stdout-stderr';

beforeEach(() => {
  pso.start();
  pse.start();
});

afterEach(() => {
  pso.stop();
  pse.stop();
});

export function stdout() {
  return pso.output;
}

export function stderr() {
  return pse.output;
}
