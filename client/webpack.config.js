var debug = process.env.NODE_ENV !== "production"
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtpol: debug ? 'inline-sourcemap' : null,
  entry: './src/scripts.js',
  output: {
    path: __dirname + '/build',
    filename: 'scripts.min.js'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
}