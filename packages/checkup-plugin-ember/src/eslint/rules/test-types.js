module.exports = {
  create: function (context) {
    let testType = 'Unit';
    return {
      'CallExpression > Identifier[name=setupRenderingTest]'(node) {
        testType = 'Rendering';
      },
      'CallExpression > Identifier[name=setupApplicationTest]'(node) {
        testType = 'Application';
      },
      'CallExpression > Identifier[name=test]'(node) {
        context.report({
          node,
          message: `test${testType}`,
        });
      },
      'CallExpression > Identifier[name=skip]'(node) {
        context.report({
          node,
          message: `skip${testType}`,
        });
      },
      'CallExpression > Identifier[name=only]'(node) {
        context.report({
          node,
          message: `only${testType}`,
        });
      },
      'CallExpression > Identifier[name=todo]'(node) {
        context.report({
          node,
          message: `todo${testType}`,
        });
      },
    };
  },
};
