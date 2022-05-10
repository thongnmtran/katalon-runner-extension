const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const client = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ]
});

module.exports = [client];
