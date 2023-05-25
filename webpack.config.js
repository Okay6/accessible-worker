const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        "main": "./src/index.ts",
    },
    plugins: [
        new HtmlWebpackPlugin({
           template:'./src/index.html'
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
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node-modules/"
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
