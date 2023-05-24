module.exports = {
    entry: {
        "accessible_worker_module": "./src/worker_module.ts",
    },
    experiments: {
        outputModule: true,
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