# Drupal API Client

An example readme update.

A core API client class that can be extended to support a variety of Drupal APIs, including:

- Drupal JSON:API Client

## Prerequisites

### Setting up the Monorepo

To configure the monorepo for development, the following should be installed
locally:

- Node.js version 18 or current LTS [pnpm env](https://pnpm.io/cli/env) is recommended to manage node versions.
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

The `api-client` package includes the base `ApiClient` class which is meant to be extended by other classes that implement logic to make it easy to fetch data from Drupal.

#### json-api-client

The `json-api-client` package includes the `JsonApiClient` class which extends the `ApiClient`, and makes it easy to fetch data from Drupal's JSON:API without deep knowledge of it.

#### utils

The `utils` package includes optional utilities that may be useful for working with the base class, but are not included in the base package.

### Examples

Examples show how the packages can be used in a variety of ways.

To configure examples to use a local Drupal environment (or override other environment variables) copy `.env.local.example` as `.env.local` in any of the example directories.

#### json-api-client-example

The json-api-client-example utilizes the JsonApiClient class to demonstrate how various configuration options can be employed for retrieving data.

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
  pnpm build:packages
  ```
- Start the `json-api-client` example in development mode:

  ```bash
  pnpm dev:json-api-client
  ```

- Format code using Prettier:

  ```bash
  pnpm prettier:fix
  ```

- Build the examples

  ```bash
  pnpm build:examples
  ```

- Run the jso-api-client-example

  ```bash
  pnpm serve:json-api-client-example
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

#### `eslint-config-airbnb-typescript` Overrides

- Use named exports instead of default exports

### Editor Integration

#### VSCode

We recommend using [VSCode](https://code.visualstudio.com/) as your editor. You will be prompted to install the recommended extensions when you open the project in VSCode. Settings are also included in this project to format code on save using Prettier.

## Versions and Releases

### Generating a Changeset

To generate a new changeset, run `pnpm changeset` in the root of the repository.
The generated Markdown files in the `.changeset` directory should be committed
to the repository.

### Creating and Publishing New Versions

Releases are automated using the [changesets-gitlab](https://www.npmjs.com/package/changesets-gitlab) package. To publish a new release:

- Create a merge request of `canary` against `main`. Do not squash commits to main as this will cause later conflicts.
- Merge the MR. When code is merged to main and changesets are detected, the release job will run. This will create a new 'Version Packages' merge request.
- Review the 'Version Packages' MR. Merge if this contains the expected package versions and changes. When merged this will publish any updated packages to NPM.
- Create a new MR of `main` against `canary`. Merge this to bring `canary` up to date with the latest package versions and changesets.

## Developing with a Local Drupal Instance

The example projects included in `/examples` use a hosted Drupal environment by default. In cases where you need to modify data or the CMS install itself, using a local Drupal environment can be helpful.

### Prerequisites

- [Install a Docker provider](https://ddev.readthedocs.io/en/stable/users/install/docker-installation/)
- [Install DDEV](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/)
- [Stop other conflicting Docker applications](https://ddev.readthedocs.io/en/stable/users/usage/troubleshooting/#method-1-stop-the-conflicting-application)

### Installing Drupal

From the root of the repository, run:

`pnpm ddev:init`

This will create a new Drupal instance in `/drupal`, build your DDEV instance, install Drupal with Umami demo data, and configure features used by the API Client. The `/drupal` directory is a clone of https://github.com/backlineint/drupal-api-demo

Drupal will be available at:

`https://drupal-api-demo.ddev.site`

and the following API endpoints will be active:

`https://drupal-api-demo.ddev.site/jsonapi`
`https://drupal-api-demo.ddev.site/router/translate-path`

You will be able to interact with your DDEV instance [using the `ddev` command](https://ddev.readthedocs.io/en/stable/users/usage/cli/) inside of the `/drupal` directory. Drush will also be installed and available via `ddev drush`.

### Removing Drupal

From the root of the repository, run:

`pnpm ddev:destroy`

This will delete your DDEV instance and remove your Drupal codebase.

## Adding a new package

Ymmv, but these are the steps I followed when creating a new package that extends api-client. I don't expect us to be doing this frequently, but if that proves wrong we could create a scaffolder for this.

- Create a new subdirectory in 'packages'
- Copy package.json from api-client into the new package directory.
- Update name, version and description in package.json. Edit dependencies if necessary.
- Add `"@drupal-api-client/api-client": "workspace:*"` as a dependency
- run `pnpm i` at the root of the repository.
- Create `README.md` in the new package directory.
- Copy the following files from `api-client` to the new package:
  - .eslintrc
  - tsconfig.json
  - tsconfig.typedoc.json
  - tsup.config.ts
  - vite.config.mts
- Create an `src` subdirectory with:
  - a typescript file named after your new class.
  - A types.ts file.
  - an index.ts file - this should export your newly created class and any types. You can model this after index.ts in the api-client package.
- It now should be possible to build by running `pnpm build` in the new package directory.
- Create tests
  - Add tests directory with at least one test.ts file.
  - Update the test object in vite.config.mts if tests do not yet use mocks or a setup file.
- Scaffold example
  - Create a new subdirectory in /examples
  - Excluding CHANGELOG.md, /dist, and /node_modules, copy the files from another example.
  - Remove and add dependencies from package.json as needed.
  - run `pnpm i` at the root of the repository.
  - Update README.md.
  - Add a src/main.ts file with your example.
  - It now should be possible to running `pnpm dev` and `pnpm build` in the new example directory.
