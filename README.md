# Trabalho Final – Automação Web com Cypress

Automação de testes E2E do site [Automation Exercise](https://automationexercise.com/test_cases) usando **Cypress** e o padrão **App Actions**, com as funcionalidades organizadas em módulos.

## Cenário automatizado

**Test Case 1 – Register User**

1. Abrir o navegador
2. Acessar `http://automationexercise.com`
3. Verificar que a home page está visível
4. Clicar em **Signup / Login**
5. Verificar que **New User Signup!** está visível
6. Preencher nome e e-mail e clicar em **Signup**
7. Verificar que **ENTER ACCOUNT INFORMATION** está visível
8. Preencher Title, Name, Email, Password e Date of birth
9. Marcar **Sign up for our newsletter!**
10. Preencher os dados de endereço e clicar em **Create Account**
11. Clicar em **Continue**
12. Verificar que **Logged in as username** está visível

> Os passos 6 e 10 não aparecem na lista do exercício, mas sem eles a conta não é criada. Ao final, a conta é excluída pela própria interface (**Delete Account**) para não acumular dados no site.

### Um cenário por passo

O spec tem um `it()` para cada passo do exercício (1-2, 3, 4, 5, 8, 9, 10, 15 e 16). Eles rodam em sequência dentro de um `describe` com `testIsolation: false`, então cada cenário continua da página em que o anterior parou. Os passos que não estão na lista do exercício entram dentro dos cenários seguintes: nome/e-mail + **Signup** no cenário 8, endereço + **Create Account** no cenário 15. A conta é excluída num `after()`.

## Arquitetura

```
cypress/
├── e2e/
│   └── signup/
│       └── register-user.cy.js     # cenário de teste (só chama App Actions)
├── support/
│   ├── e2e.js                      # registra o reporter
│   ├── factories/
│   │   └── user.factory.js         # massa de dados dinâmica com Faker
│   └── modules/
│       ├── home/                   # navegação pela home
│       ├── signup/                 # formulários de cadastro
│       └── account/                # conta criada, usuário logado, exclusão
│           ├── elements.js         # seletores centralizados do módulo
│           └── actions.js          # App Actions (funções exportadas)
cypress.config.js
.github/workflows/cypress.yml
```

### Decisões

- **App Actions por módulo:** cada funcionalidade do site tem uma pasta em `support/modules` com suas ações de negócio exportadas como funções. O spec importa cada módulo como namespace (`import * as signup from '.../modules/signup/actions'`) e chama `home.visit()`, `signup.start(user)`, `account.assertLoggedInAs(name)` etc. Assim o spec fica legível como os passos do caso de teste e cada ação deixa explícito de qual módulo vem, sem poluir o objeto global `cy`.
- **Seletores centralizados:** os localizadores ficam em `elements.js`, separados das ações. Se a tela mudar, só esse arquivo é alterado.
- **Massa de dados com Faker:** `createUser()` gera um usuário novo a cada execução, com e-mail único, para evitar o erro de "Email Address already exist!".
- **Somente interface:** todas as interações acontecem pela UI, inclusive a limpeza no `afterEach`.
- **Anúncios bloqueados:** os domínios de anúncio são bloqueados via `blockHosts`, para os testes ficarem estáveis.

## Como executar

Pré-requisitos: Node.js 18+ e Google Chrome.

```bash
npm install
npm run cy:open    # modo interativo
npm run cy:run     # headless (Electron)
npm test           # headless no Chrome
```

> **Rodando pelo terminal integrado do VS Code?** Se aparecer o erro `bad option: --no-sandbox`, rode `unset ELECTRON_RUN_AS_NODE` antes do comando.

## Relatório

O relatório HTML é gerado pelo **cypress-mochawesome-reporter** em `cypress/reports/index.html`. Quando há falha, ele traz screenshots embutidos.

## Integração contínua

O workflow `.github/workflows/cypress.yml` roda os testes no Chrome em todo push e pull request e publica o relatório como artefato da execução.
