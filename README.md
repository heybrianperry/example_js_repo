# Drupal API Client

A core API client class that can be extended to support a variety of Drupal APIs, including:

- Drupal JSON:API Client

## Prerequisites

### Setting up the Monorepo

To configure the monorepo for development, the following should be installed
locally:

- Node.js version 18 LTS. We recommend using
  [nvm](https://github.com/nvm-sh/nvm)
- [npm](https://docs.npmjs.com/cli/v8/commands/npm) version 9.x.x
- [pnpm](https://pnpm.io/installation) version 8.x

  We recommend using npm. Run the following command to install:

  ```bash
  npm install -g pnpm@8
  ```

### Workspaces

There are two main workspaces in the monorepo, `packages`, and `examples`

### Packages

#### api-client

#### json-api-client

### Examples

#### json-api-client-example

## Configure the Monorepo

To contribute to this project, follow the directions below.

1. Fork this repo
1. Clone your fork to your local machine.
1. Install dependencies for all packages and starters using the following
   command.
   ```bash
   pnpm install
   ```

### Useful Scripts

There are several scripts you can use in the monorepo.

- To see all available scripts:
  ```bash
  pnpm run
  ```
- Test all projects in the monorepo that have a test script:
  ```bash
  pnpm test
  ```
- Build all packages in the monorepo:
  ```bash
  pnpm build:pkgs
  ```
- Start the `json-api-client` example in development mode:

  ```bash
  pnpm dev:json-api-client
  ```

- Format code using Prettier:

  ```bash
  pnpm prettier:fix
  ```

- Run commands in a targeted project, folder, or workspace, using the
  [`pnpm` filter flag](https://pnpm.io/filtering).

  For example, to build the api-client (filter by namespace):

  ```bash
  pnpm --filter api-client build
  ```

If you need to run a command in a specific project, use the alias in the ROOT
`package.json` scripts (`pnpm run` to see the full list in your terminal), or
use a filter. Please do not `cd` into the project directory and use `npm` or
`yarn`.

### Coding Standards

This project is being developed with a slight variation of the [Drupal JavaScript coding standards](https://www.drupal.org/docs/develop/standards/javascript/javascript-coding-standards) in order to have a set of guidelines that work well with TypeScript. Since the AirBnb style guide does not officially have TypeScript support, we are using the [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript) package to add Typescript compatibility. We are also using [TSDoc](https://tsdoc.org/) instead of [JSDoc3](https://jsdoc.app/) to standardize our doc comments.

### Editor Integration

#### VSCode

We recommend using [VSCode](https://code.visualstudio.com/) as your editor. You will be prompted to install the recommended extensions when you open the project in VSCode. Settings are also included in this project to format code on save using Prettier.
