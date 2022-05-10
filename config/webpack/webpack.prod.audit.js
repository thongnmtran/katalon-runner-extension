const { merge } = require('webpack-merge');
const prod = require('./webpack.prod');

module.exports = merge(prod, {
  devtool: 'source-map'
});
