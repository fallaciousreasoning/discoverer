const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/assets/'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    'src'
                ],
                loader: 'ts-loader'
            }
        ]
    },

    resolve: {
        modules: [
            "node_modules",
            "src"
        ],
        extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ]
    },

    devtool: 'source-map'
};