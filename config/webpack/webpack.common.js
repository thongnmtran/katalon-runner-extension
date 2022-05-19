const { resolve } = require('path');
const { CleanPlugin } = require('webpack');


module.exports = {
  target: 'web',
  mode: 'production',
  entry: {
    client: './src/client/app/client.jsx'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    path: resolve('build'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      client: resolve(__dirname, '../../src/client'),
      main: resolve(__dirname, '../../src/main')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-typescript', '@babel/preset-react']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanPlugin()
  ]
};
