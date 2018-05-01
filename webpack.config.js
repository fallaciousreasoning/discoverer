const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',

    devtool: 'source-map',

    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },

    resolve: {
        modules: ['.', './src', 'node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        hot: true,
        contentBase: './dist'
    }
};