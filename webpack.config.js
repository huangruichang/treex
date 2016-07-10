'use strict'
const resolve = require('path').resolve
const webpack = require('webpack')
const NotifierPlugin = require('webpack-notifier')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const appDir = resolve(__dirname, './app/src')

module.exports = {

  // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
  // __dirname returns '/' when js file is built with webpack
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },

  entry: {
    'index.js': './app/src/index.js',
    'entry.js': './app/src/entry.js',
  },

  devtool: "source-map",
  //devtool: 'cheap-module-source-map',
  //devtool: 'eval',

  output: {
    pathinfo: true,
    path: './app/dist',
    filename: '[name]',
    sourceMapFilename: '[name].map',
  },

  module: {
    preLoaders: [
      { test: /\.js$/, include: appDir, loader: 'eslint' },
    ],
    loaders: [
      { test: /\.json$/, include: appDir, loader: 'json' },
      { test: /\.js$/, include: appDir, loader: 'babel' },
      { test: /\.scss$/, include: appDir, loaders: ["style", "css?modules", "sass?sourceMap"] },
      { test: /.node$/, include: appDir, loader: 'node' },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100000&name=[path][name].[ext]'}
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },

  externals: [
    // (ctx, req, cb) => {
    //   if (/^electron/.test(req)) {
    //     return cb(null, `commonjs ${req}`)
    //   }
    //   cb()
    // },
    (ctx, req, cb) => {
      if (/^[electron|react|nodegit]/.test(req)) {
        return cb(null, `commonjs ${req}`)
      }
      cb()
    },
  ],

  plugins: [
    new NotifierPlugin({ alwaysNotify: true }),
    new webpack.NoErrorsPlugin(),
    // new HtmlWebpackPlugin({
    //   template: resolve(appDir, 'index.html'),
    // }),
    new CopyWebpackPlugin([{
      from: resolve(appDir, 'index.html'),
      to: 'index.html'
    }]),
    new webpack.ProvidePlugin({
      Promise: 'bluebird',
    }),
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
    }),
  ],
}
