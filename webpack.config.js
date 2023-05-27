const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        "main": "./lib/html.ts",
    },
    plugins: [
        new HtmlWebpackPlugin({
           template:'./lib/index.html'
        }),
        new HookShellScriptPlugin({
            afterEmit: ['npm run awm']
        })
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
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
                        options: { ...babelConfig },
                    },
                    {
                        loader: "ts-loader",
                    }
                ],
            },
        ]
    },
    devServer: {
        port: 3000,
        static: 'dist',
        hot: true,
    },
    mode: "development",
}
