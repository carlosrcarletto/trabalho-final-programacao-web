import { signup } from './elements'

export function assertNewUserSignupVisible() {
  cy.get(signup.newUserForm).contains('h2', 'New User Signup!').should('be.visible')
}

export function start(user) {
  cy.get(signup.newUserName).type(user.name)
  cy.get(signup.newUserEmail).type(user.email)
  cy.get(signup.newUserButton).click()
}

export function assertAccountInfoVisible() {
  cy.contains(signup.accountInfoTitle, 'Enter Account Information', { matchCase: false })
    .should('be.visible')
}

export function fillAccountInfo(user) {
  cy.get(signup.title(user.title)).check()
  cy.get(signup.password).type(user.password, { log: false })
  cy.get(signup.birthDay).select(user.birth.day)
  cy.get(signup.birthMonth).select(user.birth.month)
  cy.get(signup.birthYear).select(user.birth.year)
}

export function subscribeNewsletter() {
  cy.get(signup.newsletter).check().should('be.checked')
}

export function fillAddressInfo({ address }) {
  cy.get(signup.firstName).type(address.firstName)
  cy.get(signup.lastName).type(address.lastName)
  cy.get(signup.company).type(address.company)
  cy.get(signup.address1).type(address.address1)
  cy.get(signup.address2).type(address.address2)
  cy.get(signup.country).select(address.country)
  cy.get(signup.state).type(address.state)
  cy.get(signup.city).type(address.city)
  cy.get(signup.zipcode).type(address.zipcode)
  cy.get(signup.mobileNumber).type(address.mobileNumber)
}

export function submit() {
  cy.get(signup.createAccountButton).click()
}
