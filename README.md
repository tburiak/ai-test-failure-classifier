# AI Test Failure Classifier

A minimal TypeScript CLI for LLM-assisted automated test failure triage in CI/CD workflows.

This repository is an engineering prototype and reference implementation. The current scope is limited to the project structure, CLI entrypoint, placeholder analysis flow, unit testing, and CI.

## Usage

```sh
npm run analyze -- examples/sample.log
```

The command currently prints a placeholder analysis message for the provided log file path.

## Development

```sh
npm install
npm run build
npm test
```

LLM provider integration, classification rules, web UI, Docker, and storage are intentionally out of scope for this initial bootstrap.
