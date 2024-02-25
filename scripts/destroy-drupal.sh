#!/bin/bash

# Exit immediately on errors.
set -e

cd drupal
ddev delete -y
cd ..
echo "Removing drupal directory..."
rm -rf drupal
