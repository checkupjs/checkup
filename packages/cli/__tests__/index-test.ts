import cmd = require('../src');

describe('@checkup/cli', () => {
  it('should output checkup result', async () => {
    let result = await cmd.run([]);

    expect(result).toMatchSnapshot();
  });
});
