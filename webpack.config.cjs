require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    historyApiFallback: {
      index: path.resolve(__dirname, 'dist'),
    },
    client: {
      overlay: false,
    },
    proxy: {
      '/api': 'http://localhost:3001',
      '/search': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/search.*': '' },
      },
      '/tracks': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/tracks.*': '' },
      },
    },
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Hey!',
    template: 'src/index.html'
  })],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ]
  }
};