const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        "accessible_worker_module": "./project/worker_module.ts",
    },
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,//不将注释提取到单独的文件中
            }),
        ],
    },
    output: {
        publicPath: './dist/',
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash].js',
        library: {
            type: "module"
        }
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
    mode: "production"
}