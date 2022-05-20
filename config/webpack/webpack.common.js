const { resolve } = require('path');
const { CleanPlugin } = require('webpack');


module.exports = {
  target: 'web',
  mode: 'production',
  entry: {
    TestCaseEntry: './src/client/app/TestCaseEntry.jsx',
    // TestSuite: './src/client/app/TestCaseEntry.jsx',
    ExplorerView: './src/client/app/ExplorerEntry.jsx'
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanPlugin({ dry: false, keep: false })
  ]
};
