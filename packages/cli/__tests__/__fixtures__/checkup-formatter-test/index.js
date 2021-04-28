class CustomFormatter {
  constructor(args = {}) {
    this.args = args;
  }

  format(results) {
    this.args.writer.log('Custom formatter output');
    this.args.writer.log(results);
  }
}

module.exports = CustomFormatter;
