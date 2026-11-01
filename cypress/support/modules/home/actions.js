import { home } from './elements'

export function visit() {
  cy.visit('/')
}

export function assertVisible() {
  cy.title().should('eq', 'Automation Exercise')
  cy.get(home.slider).should('be.visible')
}

export function goToSignupLogin() {
  cy.get(home.signupLoginLink).click()
}
