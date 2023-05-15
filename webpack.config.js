const path = require("path");

module.exports = {
    entry: "./src/worker.ts",
    experiments: {
        outputModule: true,
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        library: {
            type: "module"
        }
    },
    resolve: {
        extensions: [".ts"], // 配置ts文件可以作为模块加载
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
    mode: "development",
}
