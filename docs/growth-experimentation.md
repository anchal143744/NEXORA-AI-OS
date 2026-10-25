# Growth Experimentation

Version: 0.29.0

Growth Experimentation gives NEXORA AI a controlled platform for A/B tests, multivariate experiments, variants, results and statistical significance evaluation.

## Capabilities

- Experiment lifecycle management.
- A/B and multivariate variants.
- Result ingestion and significance evaluation.
- Experiment dashboard APIs.
- AI recommendations for future experiments and growth actions.

## API Groups

- /v1/experiments
- /v1/growth-insights

## Database Models

- Experiment
- ExperimentVariant
- ExperimentResult
- GrowthRecommendation

## Governance

Experiments are tenant scoped and workspace scoped. Decision payloads can include confidence, expected impact and actual impact so future autonomous agents can learn from measured outcomes.

## Phase Gate

- Version: 0.29.0
- Phase: Phase 29 - Enterprise Product Intelligence, Usage Analytics and Growth Experimentation
- Documentation Status: Passed
