module.exports = {
  create: function (context) {
    let testType = 'unit';

    return {
      'CallExpression > Identifier[name=setupRenderingTest]'() {
        testType = 'rendering';
      },

      'CallExpression > Identifier[name=setupApplicationTest]'() {
        testType = 'application';
      },

      'CallExpression > Identifier[name=test]'(node) {
        context.report({
          node,
          message: `${testType}|test`,
        });
      },

      'CallExpression > Identifier[name=skip]'(node) {
        context.report({
          node,
          message: `${testType}|skip`,
        });
      },

      'CallExpression > Identifier[name=only]'(node) {
        context.report({
          node,
          message: `${testType}|only`,
        });
      },

      'CallExpression > Identifier[name=todo]'(node) {
        context.report({
          node,
          message: `${testType}|todo`,
        });
      },
    };
  },
};
