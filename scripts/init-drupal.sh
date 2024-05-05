#!/bin/bash

# Exit immediately on errors.
set -e

# Create DDEV project
mkdir drupal
cd drupal
ddev config --project-name=drupal-client --project-type=drupal10 --docroot=web --create-docroot
ddev start
ddev composer create drupal/recommended-project

# Prevent composer scaffolding from overwriting development.services.yml
ddev composer config --json extra.drupal-scaffold.file-mapping '{"[web-root]/sites/development.services.yml": false}'
ddev composer config minimum-stability alpha

# Open up CORS for local development
cat ../scripts/config/enable-local-settings.php >> web/sites/default/settings.php
cp web/sites/example.settings.local.php web/sites/default/settings.local.php
cp ../scripts/config/development.services.yml web/sites/development.services.yml
mkdir config
cp ../scripts/config/graphql_compose.settings.yml config/graphql_compose.settings.yml

# Add useful composer dependencies
ddev composer require drush/drush drupal/decoupled_router drupal/jsonapi_extras drupal/simple_oauth:^5.0 drupal/graphql_compose

# Install Drupal
ddev drush site:install demo_umami --account-name=admin --account-pass=admin -y
ddev drush en jsonapi decoupled_router basic_auth jsonapi_extras simple_oauth graphql_compose graphql_compose_edges -y

# Configure JSON:API to allow CRUD operations
ddev drush config:set jsonapi.settings read_only 0 -y

# Enable some amount of GraphQL schema
ddev drush cim --partial --source=../config -y

# use the one-time link (CTRL/CMD + Click) from the command below to edit your admin account details.
ddev drush uli
ddev launch