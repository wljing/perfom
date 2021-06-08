const { resolve } = require('path');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    react: ['react'],
    reactDom: ['react-dom'],
  },
  output: {
    path: resolve('dll'),
    filename: '[name].[chunkhash:8].dll.js',
    library: '[name]_lib',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_lib',
      path: resolve('dll', '[name].manifest.json'),
    }),
  ]
}