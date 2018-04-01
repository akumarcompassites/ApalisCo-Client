require('dotenv').config();
const path = require('path');
const pwd = process.cwd();
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const wepackPlugin = require('./webpack.plugin');
const wepackLoaderRules = require('./webpack.loder');

let compressOptions = {
  arrows: true,
  booleans: true,
  comparisons: true,
  collapse_vars: true,
  computed_props: true,
  conditionals: true,
  compress: {
    global_defs: {
      '@console.log': 'alert'
    },
    passes: 2
  },
  reduce_vars: true
};

module.exports = {
  watch: true,
  devtool: 'source-map',
  entry: {
    main: path.resolve(pwd, 'src', 'index.js')
  },
  output: {
    path: path.resolve(pwd, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.scss', '.css'],
    alias: {
      '@': path.resolve(pwd, 'src'),
      scss: path.resolve(pwd, 'src/public/scss'),
      css: path.resolve(pwd, 'src/public/css')
    }
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  module: {
    rules: [...wepackLoaderRules]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        test: /\.js($|\?)/i,
        cache: true,
        parallel: 8,
        uglifyOptions: {
          ecma: 8,
          warnings: false,
          compress: { ...compressOptions },
          mangle: true,
          output: {
            beautify: false,
            comments: false
          },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        },
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      })
    ],
    runtimeChunk: {
      name: 'vendor'
    },
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -10
        }
      }
    }
  },
  node: {
    fs: 'empty'
  },
  plugins: [...wepackPlugin]
};
