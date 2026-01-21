## ADR 1: Monorepo Architecture with PNPM Workspaces - Workspace Structure

1. All new packages and modules MUST be added to the PNPM workspace configuration in pnpm-workspace.yaml and follow the established packages/* directory structure

---

## ADR 1: Adopt Modular Package Architecture with Specialized Client Libraries

1. Implement a modular package architecture that separates concerns into distinct npm packages: specialized client libraries (api-client, json-api-client, graphql-client), shared utilities (utils package with common functionality like caching), documentation infrastructure (docs with Svelte configuration and content management), and practical examples. Each package maintains its own entry point (index.ts), test setup (setupFile.ts), and configuration, enabling independent development, testing, and deployment cycles while sharing common patterns and utilities.