const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const TerserPlugin = require("terser-webpack-plugin");
const {  author  } = require('./package');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require("fs")
let NOTICE = fs.readFileSync('NOTICE',"utf8");

module.exports = {
    entry: "./src/lib.ts",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {...babelConfig},
                    },
                    {
                        loader: "ts-loader",
                    }
                ],
            },
        ]
    },
    optimization: {

        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: RegExp(`${author}`),
                    },
                },
                extractComments: false,//不将注释提取到单独的文件中
            }),
            new webpack.BannerPlugin({
                entryOnly: true,
                banner: NOTICE,
                raw: true,
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname,'LICENSE'),
                to: './',
            },
                {
                    from: path.join(__dirname,'NOTICE'),
                    to: './',
                }]
        })
    ],
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist/umd'),
        library: {
            type: 'umd',
            name: {
                amd: '@accessible_worker',
                commonjs: '@accessible_worker',
                root: '@accessible_worker',
            },
        },
    },
    mode: "production",
}
