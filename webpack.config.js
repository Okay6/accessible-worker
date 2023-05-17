const path = require("path");

module.exports = {
    entry: "./src/experiment.ts",
    experiments: {
        outputModule: true,
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "src/worker/modules"),
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
