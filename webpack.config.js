const path = require("path");

module.exports = {
    entry: {
        "main": "./src/experiment.ts",
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "src/worker"),
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
