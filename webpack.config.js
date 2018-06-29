const path = require('path');

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
  }
};
