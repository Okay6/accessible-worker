const wp  = require('@cypress/webpack-preprocessor')

const webpackoptions ={
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude:["node_modules"],
                use: [

                    {
                        loader: "ts-loader",
                    }
                ],
            },
        ]
    },
}
module.exports = wp(webpackoptions)