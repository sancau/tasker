var debug = process.env.NODE_ENV !== "production"
var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  devtpol: debug ? 'inline-sourcemap' : null,
  entry: './js/scripts.js',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-class-properties', 'transform-decorators-legacy']
        }
      }
    ]
  },  
  output: {
    path: __dirname + '/src',
    filename: 'scripts.min.js'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
}