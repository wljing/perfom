const webpack = require('webpack');
const base = require('./webpack.config.base.js');
const { merge } = require('webpack-merge');

const config = {
  devServer: {
    contentBase: './src',
    port: 3001,
    hot: true,
    host: 'localhost',
    open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};

module.exports = merge(base, config);