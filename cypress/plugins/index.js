const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = (on, config) => {
    require('@cypress/code-coverage/task')(on, config)

    // add other tasks to be registered here

    // IMPORTANT to return the config object
    // with the any changed environment variables
    on('file:preprocessor', cypressTypeScriptPreprocessor);

    return config
}