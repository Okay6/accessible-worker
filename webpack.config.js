const path = require("path");

module.exports = {
    entry: "./src/index.ts",
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
