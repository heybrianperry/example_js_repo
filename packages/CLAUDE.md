## ADR 1: Monorepo Architecture with PNPM Workspaces - Workspace Structure

1. All new packages and modules MUST be added to the PNPM workspace configuration in pnpm-workspace.yaml and follow the established packages/* directory structure

---

## ADR 1: Adopt Multi-Client API Architecture with Specialized Client Packages

1. Implement a multi-package architecture with specialized API client libraries, each dedicated to a specific API standard or integration pattern. Create separate packages for json-api-client, graphql-client, api-client, and decoupled-router-client. Each package is independently buildable (using tsup/vite), testable (with MSW mock servers and handlers), and publishable. This allows each client to implement protocol-specific optimizations, type definitions, and error handling while sharing common build tooling patterns across packages.