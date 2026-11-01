import { account } from './elements'

export function continueAfterCreated() {
  cy.get(account.accountCreated).should('be.visible')
  cy.get(account.continueButton).click()
  cy.location('pathname').should('eq', '/')
}

export function assertLoggedInAs(name) {
  cy.get(account.headerMenu).contains('a', `Logged in as ${name}`).should('be.visible')
}

export function deleteAccount() {
  cy.get(account.deleteAccountLink).click()
  cy.get(account.accountDeleted).should('be.visible')
  cy.get(account.continueButton).click()
}
