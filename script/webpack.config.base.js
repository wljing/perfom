const webpack = require('webpack');
const { join, resolve } = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const Happypack = require('happypack');
const os = require('os');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const fs = require('fs');

const dllFilenameList = fs.readdirSync(resolve('dll'), { encoding: 'utf-8' }).filter(v => /.js$/.test(v));
const happypackPool = Happypack.ThreadPool({ size: os.cpus().length });
const plugins = [
  new Happypack({
    id: 'js',
    threads: 3,
    verbose: false,
    loaders: ['babel-loader'],
    threadPool: happypackPool,
    debug: false,
  }),
  // new Happypack({
  //   id: 'ts',
  //   loaders: ['ts-loader'],
  //   threadPool: happypackPool,
  // }),
  new Happypack({
    id: 'css',
    loaders: ['style-loader', 'css-loader'],
    threadPool: happypackPool,
  }),
  new Happypack({
    id: 'sass',
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
    threadPool: happypackPool,
  }),
  new Happypack({
    id: 'file',
    loaders: ['file-loader'],
    threadPool: happypackPool,
  }),
];

module.exports = {
  entry: {
    index: './index.js',
  },
  output: {
    path: resolve('dist'),
    filename: '[name]..js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json'],
    alias: {
      '@': join(__dirname, '../src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: ['happypack/loader?id=js'],
        exclude: /node_module/,
      },
      {
        test: /\.css$/,
        use: ['happypack/loader?id=css'],
      },
      {
        test: /\.scss$/,
        use: ['happypack/loader?id=sass'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['happypack/loader?id=file'],
      },
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: resolve('index.html'),
      filename: 'index.html'
    }),
    new webpack.DllReferencePlugin({
      manifest: resolve('dll', 'react.manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      manifest: resolve('dll', 'reactDom.manifest.json'),
    }),
    ...dllFilenameList.map(filename => {
      console.log(resolve('dll', filename));
      return new AddAssetHtmlWebpackPlugin({
        filepath: resolve('dll', filename),
      })
    }),
    ...plugins,
  ],
}