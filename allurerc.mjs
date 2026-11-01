import { defineConfig } from 'allure'

export default defineConfig({
  name: 'Automation Exercise - Histórico de Execuções',
  output: './allure-report',
  // Arquivo com o resultado de cada execução; o CI guarda ele entre as execuções
  historyPath: './allure-history/history.jsonl',
  historyLimit: 30,
})
