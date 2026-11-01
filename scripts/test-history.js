// Junta o resultado JUnit da execução atual ao histórico e imprime um quadro
// em Markdown (🟢 passou / 🔴 falhou / ⚪ não executou) para o Job Summary do CI.
//
// Uso: node scripts/test-history.js <pasta-junit> <arquivo-historico.json>

const fs = require('fs')
const path = require('path')

const MAX_RUNS = 10
const ICONS = { passed: '🟢', failed: '🔴', skipped: '⚪' }

const [junitDir, historyFile] = process.argv.slice(2)

function decodeXml(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

// Lê os <testcase> dos XMLs: o título do cenário fica no atributo classname
function readJunitResults(dir) {
  const results = {}
  if (!fs.existsSync(dir)) return results

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.xml'))) {
    const xml = fs.readFileSync(path.join(dir, file), 'utf8')
    const testcases = xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)

    for (const [, attrs, , body = ''] of testcases) {
      const name = decodeXml(attrs.match(/classname="([^"]*)"/)[1])
      if (/<(failure|error)\b/.test(body)) results[name] = 'failed'
      else if (/<skipped\b/.test(body)) results[name] = 'skipped'
      else results[name] = 'passed'
    }
  }
  return results
}

function readHistory(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return { runs: [] }
  }
}

function currentRun(results) {
  const { GITHUB_RUN_NUMBER, GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env
  return {
    number: GITHUB_RUN_NUMBER || 'local',
    url: GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null,
    date: new Date().toISOString(),
    results,
  }
}

function renderMarkdown(runs) {
  // Cenários na ordem da execução mais recente; os que sumiram vão para o final
  const scenarios = [...new Set(runs.slice().reverse().flatMap((run) => Object.keys(run.results)))]

  const header = runs.map((run) => (run.url ? `[#${run.number}](${run.url})` : `#${run.number}`))
  const lines = [
    `## Histórico dos cenários (últimas ${runs.length} execuções)`,
    '',
    `| Cenário | ${header.join(' | ')} | ✅ | ❌ |`,
    `|---|${runs.map(() => ':-:').join('|')}|:-:|:-:|`,
  ]

  for (const scenario of scenarios) {
    const statuses = runs.map((run) => run.results[scenario] || 'skipped')
    const passed = statuses.filter((s) => s === 'passed').length
    const failed = statuses.filter((s) => s === 'failed').length
    const icons = statuses.map((s) => ICONS[s])
    lines.push(`| ${scenario.replace(/\|/g, '\\|')} | ${icons.join(' | ')} | ${passed} | ${failed} |`)
  }

  lines.push('', '🟢 passou · 🔴 falhou · ⚪ não executado')
  return lines.join('\n')
}

const results = readJunitResults(junitDir)
const history = readHistory(historyFile)

if (Object.keys(results).length > 0) {
  history.runs = [...history.runs, currentRun(results)].slice(-MAX_RUNS)
  fs.mkdirSync(path.dirname(historyFile), { recursive: true })
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2))
}

console.log(history.runs.length ? renderMarkdown(history.runs) : 'Nenhum resultado de teste encontrado.')
