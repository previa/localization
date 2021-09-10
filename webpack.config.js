var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/index.jsx',
  target: 'web',
  output : {
    path: BUILD_DIR + '/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=/[name].[ext]'
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=/[name].[ext]'
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=/[name].[ext]'
      },
      {
        test: /\.[ot]tf(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=/[name].[ext]'
      },
      {
        test: /\.eot(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=/[name].[ext]'
      }
    ]
  }
};

module.exports = config;
