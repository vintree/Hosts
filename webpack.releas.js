var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var fileConfig = require('./get-entry');

var copyFile = fileConfig.copyFile()

copyFile.push({
    from: './scr/js/lib',
    to: './dist/js/lib'
})

module.exports = {
    cache: true,
    target: 'electron',
    // target: 'web',
    entry: fileConfig.getEntry(),
    output: {
        path: path.join(__dirname, './'),
        filename: '[name]'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/, 
                loader: ['babel'],
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                }
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.[woff|ttf|eot|svg]$/,
                loader: "url?limit=10000&minetype=application/font-woff"
            },
            {
                loader: 'json-loader',
                test: /\.json?$/,
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new Clean(['./app', '']),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new CopyWebpackPlugin(copyFile)
    ]
}