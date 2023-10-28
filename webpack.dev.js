const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const dev = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
};

module.exports = merge(common, dev);
