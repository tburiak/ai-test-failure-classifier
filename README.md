# AI Test Failure Classifier

A minimal TypeScript CLI for LLM-assisted automated test failure triage in CI/CD workflows.

This repository is an engineering prototype and reference implementation. The current scope is limited to the project structure, CLI entrypoint, placeholder analysis flow, unit testing, and CI.

## Usage

Console output:

```sh
npm run analyze -- examples/cypress-locator-failure.log
```

The command parses the provided log, runs the default mock LLM analyzer, and prints a plain-text triage summary:

```text
Failure analysis summary
Test name: Login form shows required email validation
Framework: cypress
Source file: cypress/e2e/login.cy.ts
Classification: locator_ui_change
Confidence: 0.86
Manual review required: false
Reason: The Cypress failure indicates a missing expected locator in the UI.
Matched signals:
- CypressError
- Expected to find element
Recommended action: Verify whether the locator changed or the UI no longer renders the expected element.
```

JSON output:

```sh
npm run analyze -- examples/cypress-locator-failure.log --json output/result.json
```

Markdown report output:

```sh
npm run analyze -- examples/cypress-locator-failure.log --markdown output/report.md
```

A stable sample Markdown report is available at `reports/sample-report.md` for quick review.

Both report formats can be written in one run:

```sh
npm run analyze -- examples/cypress-locator-failure.log --json output/result.json --markdown output/report.md
```

Provider selection:

```sh
npm run analyze -- examples/cypress-locator-failure.log --provider mock
```

The mock provider is the default and does not make network calls. An optional OpenAI provider is available for manual experiments:

```sh
$env:OPENAI_API_KEY = "sk-..."
$env:OPENAI_MODEL = "gpt-4o-mini"
npm run analyze -- examples/cypress-locator-failure.log --provider openai --json output/openai-result.json --markdown output/openai-report.md
```

`OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`. API keys must never be committed to the repository.

Do not run the tool on logs containing secrets or sensitive data unless the logs are sanitized first. JSON reports include the raw log content for traceability.

## Development

```sh
npm install
npm run build
npm test
```

LangChain, agents, streaming, retry logic, HTML reports, web UI, Docker, storage, and databases are intentionally out of scope for this initial bootstrap.
