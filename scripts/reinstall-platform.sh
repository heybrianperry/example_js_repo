# Currently intended to be run manually.

# SSH into the platform
platform ssh

# Reinstall Drupal
drush site:install demo_umami --account-name=<uname> --account-pass=<pass> -y

# Apply Recipies
cd web
php core/scripts/drupal recipe recipes/api_client_base
php core/scripts/drupal recipe recipes/api_client_jsonapi
php core/scripts/drupal recipe recipes/api_client_graphql

# I was only able to get the recipe script to run inside the container.
# Using the CLI remotely would look something like this:

# platform ssh -p <project> -e <environment> -- php web/core/scripts/drupal recipe recipes/api_client_base