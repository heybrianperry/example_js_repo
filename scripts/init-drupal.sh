#!/bin/bash

# Exit immediately on errors.
set -e

# Clone the demo site repo
git clone git@github.com:backlineint/drupal-api-demo.git drupal && cd drupal

# Initalize ddev
ddev start
ddev composer install

# Open up CORS for local development
cat ../scripts/config/enable-local-settings.php >> web/sites/default/settings.php
cp web/sites/example.settings.local.php web/sites/default/settings.local.php

# Install Drupal
ddev drush site:install demo_umami --account-name=admin --account-pass=admin -y

# Apply recipe
ddev drush cr
ddev exec -d /var/www/html/web php core/scripts/drupal recipe recipes/api_client_base
ddev exec -d /var/www/html/web php core/scripts/drupal recipe recipes/api_client_jsonapi
ddev exec -d /var/www/html/web php core/scripts/drupal recipe recipes/api_client_graphql
ddev drush cr
# Since this repo is in version control, recipes have already been unpacked
# ddev composer unpack drupal/api_client_jsonapi

# Open Drupal in browser
ddev drush uli | xargs open

