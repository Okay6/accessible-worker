const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const TerserPlugin = require("terser-webpack-plugin");
const {author} = require('./package');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require("fs")
let NOTICE_COMMENT = fs.readFileSync('NOTICE_COMMENT', "utf8");

module.exports = {
    entry: "./lib/index.ts",
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
                banner: NOTICE_COMMENT,
                raw: true,
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, 'LICENSE'),
                to: './',
            },
                {
                    from: path.join(__dirname, 'NOTICE'),
                    to: './',
                },
                {
                    from: path.join(__dirname, 'third_licenses'),
                    to: './third_licenses',
                }
            ]
        })
    ],
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'output'),
        library: {
            type: 'umd',
            name: {
                amd: 'accessible-worker',
                commonjs: 'accessible-worker',
                root: 'accessible_worker',
            },
        },
    },
    externals: {
        acorn: {
            root: 'acorn',
            commonjs: 'acorn',
            commonjs2: 'acorn',
            amd: 'acorn',
        },
        'acorn-walk': {
            root: 'acorn-walk',
            commonjs: 'acorn-walk',
            commonjs2: 'acorn-walk',
            amd: 'acorn-walk',
        },
        'hash-it': {
            root: 'hash-it',
            commonjs: 'hash-it',
            commonjs2: 'hash-it',
            amd: 'hash-it',
        },
        'reflect-metadata': {
            root: 'reflect-metadata',
            commonjs: 'reflect-metadata',
            commonjs2: 'reflect-metadata',
            amd: 'reflect-metadata',
        },
    },
    devtool: 'source-map',
    mode: "production",
}
