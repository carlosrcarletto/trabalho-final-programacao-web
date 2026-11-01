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
npm run cy:report  # abre o relatório HTML da última execução (macOS)
```

> **Rodando pelo terminal integrado do VS Code?** Se aparecer o erro `bad option: --no-sandbox`, rode `unset ELECTRON_RUN_AS_NODE` antes do comando.

## Relatório

Cada execução gera três relatórios:

- **HTML** (`cypress/reports/index.html`), do **cypress-mochawesome-reporter**: um único arquivo com gráficos e, quando há falha, screenshots embutidos.
- **JUnit XML** (`cypress/results/*.xml`), do **mocha-junit-reporter**: usado pelo CI para mostrar os resultados no GitHub.
- **Allure** (`allure-results/`), do **allure-cypress**: no CI, vira um relatório com **histórico por cenário**.

Os dois primeiros saem juntos via **cypress-multi-reporters**. O Allure é um plugin à parte, e o **cypress-on-fix** permite que ele e o Mochawesome usem os mesmos eventos do Cypress sem um sobrescrever o outro.

## Integração contínua

O workflow `.github/workflows/cypress.yml` roda os testes no Chrome em todo push e pull request. Em seguida, mesmo quando há falha:

- publica cada cenário na aba **Checks** ("Resultados Cypress"), com a mensagem de erro dos que falharam;
- anexa o relatório HTML como artefato `cypress-report`, guardado por 14 dias;
- na branch principal, gera o **relatório Allure com histórico** e publica no GitHub Pages: `https://carlosrcarletto.github.io/trabalho-final-programacao-web/`.

### Histórico de execuções (Allure)

A cada execução, o relatório anterior é recuperado da branch `gh-pages`, e o novo relatório já inclui as execuções passadas. As últimas 30 ficam guardadas. Lá é possível ver:

- **Trend**, na página inicial: gráfico de quantos cenários passaram ou falharam em cada execução;
- **History**, na aba de cada cenário: quantas vezes aquele cenário passou ou falhou e o percentual de sucesso;
- **Flaky**: cenários que alternam entre passar e falhar.

**Configuração única:** depois do primeiro push na branch principal, acesse *Settings → Pages* e, em *Source*, escolha **Deploy from a branch → `gh-pages` / `(root)`**.
# trabalho-final-programacao-web
