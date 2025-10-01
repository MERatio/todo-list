const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: ['./src/template.html'],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
};

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'prepend',
    },
  },
})(common, dev);
