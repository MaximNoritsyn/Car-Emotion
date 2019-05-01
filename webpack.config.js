//var webpack = require('webpack');
var path = require('path');
//var htmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/main.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([ { from: 'src/assets/i18n', to: 'assets/i18n' } ])
  ]
};
