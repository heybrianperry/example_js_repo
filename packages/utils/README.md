# Utilities and other tools

This package contains optional utilities that may be useful for working with the Drupal API Client, but are not included in the base package.

## Installation

```shell
npm install @drupal-api-client/utils
```

## Usage

### createCache

```typescript
import { createCache } from "@drupal-api-client/utils";

const cache = createCache();
```

A cache based on [Nanostores](https://github.com/nanostores/nanostores) that satisfies the `@drupal-api-client/api-client` cache interface.
