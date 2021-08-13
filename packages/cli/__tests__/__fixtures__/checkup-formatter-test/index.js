class CustomFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  format(logParser) {
    this.options.writer.log('Custom formatter output');
    this.options.writer.log(logParser.log);
  }
}

module.exports = CustomFormatter;
