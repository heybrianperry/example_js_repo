#!/bin/bash

# Exit immediately on errors.
set -e

# Create DDEV project
mkdir drupal
cd drupal
ddev config --project-type=drupal10 --docroot=web --create-docroot
ddev start
ddev composer create drupal/recommended-project

# Prevent composer scaffolding from overwriting development.services.yml
ddev composer config --json extra.drupal-scaffold.file-mapping '{"[web-root]/sites/development.services.yml": false}'

# Open up CORS for local development
cat ../scripts/config/enable-local-settings.php >> web/sites/default/settings.php
cp web/sites/example.settings.local.php web/sites/default/settings.local.php
cp ../scripts/config/development.services.yml web/sites/development.services.yml

# Add useful composer dependencies
ddev composer require drush/drush drupal/decoupled_router drupal/jsonapi_extras

# Install Drupal
ddev drush site:install demo_umami --account-name=admin --account-pass=admin -y
ddev drush en jsonapi decoupled_router basic_authn jsonapi_extras -y

# Configure JSON:API to allow CRUD operations
ddev drush config:set jsonapi.settings read_only 0 -y

# use the one-time link (CTRL/CMD + Click) from the command below to edit your admin account details.
ddev drush uli
ddev launch