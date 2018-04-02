
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pwd = process.cwd();
module.exports = [
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name].[hash].css').replace('css/js', 'css');
    },
    allChunks: true
  }),
  new Dotenv({
    path: path.resolve(pwd, '.env'),
    safe: true,
    systemvars: true,
    silent: true
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new HtmlWebPackPlugin({
    template: path.resolve(pwd, 'src') + '/index.html',
    filename: path.resolve(pwd, 'dist') + '/index.html',
    inject: 'body'
  }),
  new webpack.HotModuleReplacementPlugin({
    multiStep: true
  })
];
