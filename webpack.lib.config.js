const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const TerserPlugin = require("terser-webpack-plugin");
const { name, version, author, homepage, description } = require('./package');
const nunjucks = require('nunjucks');
const moment = require('moment');

// 使用模板渲染
const LICENSE = nunjucks.render('LICENSE', {
    name: name,
    version: version,
    description: description,
    author: author,
    homepage: homepage,
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
});

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
                        comments: RegExp(`${name}`),
                    },
                },
                extractComments: false,//不将注释提取到单独的文件中
            }),
            new webpack.BannerPlugin({
                entryOnly: true,
                banner: LICENSE,
                raw: true,
            }),
        ],
    },
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
