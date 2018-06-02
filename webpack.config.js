const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',

    devtool: 'source-map',

    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },

    resolve: {
        modules: ['.', './', 'node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
    ],

    devServer: {
        hotOnly: true,
        inline: true,
        contentBase: './dist',
        historyApiFallback: true,

        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
};