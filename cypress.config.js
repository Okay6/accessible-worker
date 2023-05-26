module.exports = {
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables

      // tell Cypress to use .babelrc file
      // and instrument the specs files
      // only the extra application files will be instrumented
      // not the spec files themselves

      return config
    },
  },
}