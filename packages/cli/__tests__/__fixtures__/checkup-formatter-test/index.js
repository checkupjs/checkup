class CustomFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  format(logParser) {
    return `Custom formatter output ${logParser.log}`;
  }
}

module.exports = CustomFormatter;
