const { defineConfig } = require('cypress')
const { allureCypress } = require('allure-cypress/reporter')

module.exports = defineConfig({
  // HTML (Mochawesome) para leitura humana + JUnit XML para o CI
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    cypressMochawesomeReporterReporterOptions: {
      reportDir: 'cypress/reports',
      reportPageTitle: 'Automation Exercise - Relatório de Testes',
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/results/junit-[hash].xml',
    },
  },
  e2e: {
    baseUrl: 'https://automationexercise.com',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    video: false,
    // Bloqueia anúncios que poluem/travam as páginas do site
    blockHosts: [
      '*googlesyndication.com',
      '*doubleclick.net',
      '*googleadservices.com',
      '*adservice.google.com',
      '*googletagmanager.com',
      '*google-analytics.com',
    ],
    setupNodeEvents(cypressOn, config) {
      // Permite que Mochawesome e Allure registrem os mesmos eventos sem um sobrescrever o outro
      const on = require('cypress-on-fix')(cypressOn)
      require('cypress-mochawesome-reporter/plugin')(on)
      allureCypress(on, config)
      return config
    },
  },
})
