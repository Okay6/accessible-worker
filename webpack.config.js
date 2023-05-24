const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');  //引入这个html模板的类

module.exports = {
    entry: {
        "main": "./src/experiment.ts",
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"], // 配置ts文件可以作为模块加载
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node-modules/"
            }
        ]
    },

    devServer: {
        port: 3000,
        static: 'dist',
        hot: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            templateParameters: {
                assets: {
                    publicPath: 'dist',
                    js: ['accessible_worker_module.js']
                }
            }


        })
    ],

    mode: "development",
}
