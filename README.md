# AI Test Failure Classifier

A minimal TypeScript CLI for LLM-assisted automated test failure triage in CI/CD workflows.

This repository is an engineering prototype and reference implementation. The current scope is limited to the project structure, CLI entrypoint, placeholder analysis flow, unit testing, and CI.

## Usage

```sh
npm run analyze -- examples/cypress-locator-failure.log
```

The command parses the provided log, runs the mock LLM analyzer, and prints a plain-text triage summary:

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

## Development

```sh
npm install
npm run build
npm test
```

OpenAI integration, real provider calls, report generation, web UI, Docker, and storage are intentionally out of scope for this initial bootstrap.
