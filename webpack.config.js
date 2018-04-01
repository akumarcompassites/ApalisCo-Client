require('dotenv').config();
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');

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
    main: path.resolve(__dirname, 'src') + '/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      scss: path.resolve(__dirname, 'src/public/scss'),
      css: path.resolve(__dirname, 'src/public/css')
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
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /^(?!.*\.{test,min}\.js$).*\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: true } }]
      },
      {
        test: /\.(json|xml|svg|png|jpe?g|gif|ico)$/i,
        use: [
          { loader: 'file-loader', options: { name: '[path][name].[ext]' } }
        ]
      },
      {
        test: /\.(eot|otf|svg|ttf|woff|woff2)(\?[\s\S]+)?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash].[ext]'
          }
        }],
        include: path.join(__dirname, 'src/public', 'fonts')
      },
      {
        test: /\.(eot|otf|svg|ttf|woff|woff2)(\?[\s\S]+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: true,
      //         minimize: true,
      //         sourceMap: true,
      //         camelCase: true,
      //         localIdentName: '[name]__[local]___[hash:base64:5]',
      //         importLoaders: 2 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
      //       }
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: () => [require('autoprefixer')]
      //       }
      //     },
      //     'sass-loader'
      //   ]
      // }
      {
        test:/\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                // minimize: true,
                // modules: true,
                // sourceMap: true,
                camelCase: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
                // importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // plugins: () => [require('autoprefixer')]
                plugins: () => {
                  require('rucksack-css')({
                    autoprefixer: true
                  });
                }
              }
            },
            { loader: 'sass-loader', options: { minimize: true } }
          ],
          fallback: 'style-loader'
        })
      }
    ]
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
  plugins: [
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('css/[name].[hash].css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new Dotenv({
      path: path.resolve(process.cwd(), '.env'),
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
      template: path.resolve(__dirname, 'src') + '/index.html',
      filename: path.resolve(__dirname, 'dist') + '/index.html',
      inject: 'body'
    })
  ]
};
