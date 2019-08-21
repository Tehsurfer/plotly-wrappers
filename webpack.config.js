var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: "none",
  entry: {
    "build": "./plot_manager.js",
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js",
    library: 'plotlywrappers',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
    ]
  },
  plugins: [
  ]
};
