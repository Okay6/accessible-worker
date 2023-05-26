const {CODE_COVERAGE} = process.env;

const plugins = [['@babel/plugin-proposal-decorators', { legacy: true }], ["istanbul", {
    "exclude": [
        "**/*.spec.ts",
        "**/index.ts"
    ]
}]]


module.exports = {
    presets: [
        '@babel/typescript',
    ],
    plugins:plugins,
    babelrc: false,
};
