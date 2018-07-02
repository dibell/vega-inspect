const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: [
    path.resolve('./app/index.js')
  ],
  output: {
    path: path.resolve('./build/'),
    filename: 'app.js',
    publicPath: '.'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.json']
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([ 
      'extension/background.js',
      'extension/contentscript.js',
      'extension/devtools.html',
      'extension/devtools.js',
      'extension/manifest.json',
      'extension/panel.html',
    ], {}),
  ]
};
