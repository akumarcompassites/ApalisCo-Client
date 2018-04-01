
const pwd = process.cwd();
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    test: /\.(jsx?)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    },
    include: path.resolve(pwd, 'src')
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
    include: path.resolve(pwd, 'src', 'public', 'fonts')
  },
  {
    test: /\.(eot|otf|svg|ttf|woff|woff2)(\?[\s\S]+)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  },
  {
    test:/\.(s*)css$/,
    use: ExtractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true,
            modules: true,
            sourceMap: true,
            camelCase: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            importLoaders: 2
          }
        },
        {
          loader: 'postcss-loader',
          options: {
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
];
