const {NODE_ENV} = process.env;

const plugins = [['@babel/plugin-proposal-decorators', { legacy: true }]]
if(NODE_ENV === 'development'){
    plugins.push(["istanbul", {
        "exclude": [
            "**/*.spec.ts",
            "**/html.ts"
        ]
    }])
}

module.exports = {
    presets: [
        '@babel/typescript',
    ],
    plugins:plugins,
    babelrc: false,
};
