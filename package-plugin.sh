#!/bin/bash

# Exit on error
set -e

echo "Step 1: Installing dependencies..."
npm install

echo "Step 2: Building production assets..."
npm run build

echo "Step 3: Creating clean distribution folder..."
DIST_FOLDER="wordpress.org"
PLUGIN_SLUG="wp-rest-route-manager"
STAGING_DIR="$DIST_FOLDER/$PLUGIN_SLUG"

# Clean up previous builds
rm -rf "$DIST_FOLDER"
mkdir -p "$STAGING_DIR"

echo "Step 4: Copying plugin files..."
cp wp-rest-route-manager.php "$STAGING_DIR/"
cp readme.txt "$STAGING_DIR/"
cp -r includes "$STAGING_DIR/"
cp -r build "$STAGING_DIR/"

echo "Step 5: Creating zip file..."
cd "$DIST_FOLDER"
zip -r "${PLUGIN_SLUG}.zip" "$PLUGIN_SLUG"
cd ..

echo "------------------------------------------------"
echo "Success! Plugin packaged for WordPress.org"
echo "Location: $DIST_FOLDER/${PLUGIN_SLUG}.zip"
echo "Contents of $DIST_FOLDER/:"
ls -F "$DIST_FOLDER/"
echo "------------------------------------------------"
