import { createUser } from '../../support/factories/user.factory'
import * as home from '../../support/modules/home/actions'
import * as signup from '../../support/modules/signup/actions'
import * as account from '../../support/modules/account/actions'

// Cenários dependentes: cada it continua a partir da página deixada pelo anterior
describe('Cadastro de usuário', { testIsolation: false }, () => {
  const user = createUser()

  after(() => {
    account.deleteAccount()
  })

  it('1-2. Launch browser e navegar para a url', () => {
    home.visit()
  })

  it('3. Verificar que a home page está visível', () => {
    home.assertVisible()
  })

  it("4. Clicar no botão 'Signup / Login'", () => {
    home.goToSignupLogin()
  })

  it("5. Verificar que 'New User Signup!' está visível", () => {
    signup.assertNewUserSignupVisible()
  })

  it("8. Verificar que 'ENTER ACCOUNT INFORMATION' está visível", () => {
    signup.start(user)
    signup.assertAccountInfoVisible()
  })

  it('9. Preencher Title, Name, Email, Password e Date of birth', () => {
    signup.fillAccountInfo(user)
  })

  it("10. Marcar o checkbox 'Sign up for our newsletter!'", () => {
    signup.subscribeNewsletter()
  })

  it("15. Clicar no botão 'Continue'", () => {
    signup.fillAddressInfo(user)
    signup.submit()
    account.continueAfterCreated()
  })

  it("16. Verificar que 'Logged in as username' está visível", () => {
    account.assertLoggedInAs(user.name)
  })
})
