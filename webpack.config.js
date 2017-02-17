'use strict';

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

const basePath = './';
const dirPublic = path.resolve(__dirname, basePath, 'public');
const dirImages = path.resolve(__dirname, dirPublic, 'images');
const dirHTML = path.resolve(__dirname, dirPublic, 'html');
const dirJS = path.resolve(__dirname, dirPublic, 'js');
const dirBuild = path.resolve(basePath, 'build');
const env = process.env.NODE_ENV || 'development';

let baseConfig = {
    entry: {
      main: path.join(dirJS, 'app.js'),
      vendor: [
        'babel-polyfill',
        path.join(dirJS, 'vendor/fetch-polyfill.js')
      ]
    },
    output: {
        filename: '[name].js?[hash]',
        path: dirBuild,
        publicPath: '/'
    },
    resolve: {
      alias: {
        bourbon: path.resolve(__dirname, basePath, 'node_modules/bourbon/app/assets/stylesheets'),
        breakpoint: path.resolve(__dirname, basePath, 'node_modules/breakpoint-sass/stylesheets')
      }
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: [
                path.resolve(__dirname, 'node_modules'),
                dirJS + '/**/*.spec.js'
            ],
            options: {
              'plugins': ['transform-decorators-legacy'],
              'presets': ['es2015']
            }
          },
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: 'file-loader?name=images/[name].[ext]?[hash]'
          }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
          {
            from: dirImages,
            to: 'images',
            ignore: [
              '.DS_Store'
            ]
          }
        ]),
        new ExtractTextPlugin({
          filename: 'css/styles.css?[hash]',
          allChunks: true
        }),
        new HtmlWebpackPlugin({
          hash: true,
          template: path.join(dirHTML, 'index.html')
        })
    ]
};
let envConfig = require(`./config/webpack.config.${env}.js`);

module.exports = merge(baseConfig, envConfig);
