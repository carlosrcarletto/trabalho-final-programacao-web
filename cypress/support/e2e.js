import 'cypress-mochawesome-reporter/register'

// Scripts de terceiros (anúncios) do site lançam erros que não fazem parte do teste
Cypress.on('uncaught:exception', () => false)
