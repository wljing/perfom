const base = require('./webpack.config.base.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

const config = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
  ],
	devtool: 'cheap-source-map',
};

module.exports = merge(base, config);