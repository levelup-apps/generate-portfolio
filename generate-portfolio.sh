#!/bin/bash

# generate-portfolio.sh

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v pnpm >/dev/null 2>&1; then
    echo "Error: pnpm is required but not installed."
    echo "Please install pnpm "
    exit 1
fi

# Create a temporary directory for the project
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR" || exit 1

# Initialize a new Node.js project
#npm init -y >/dev/null 2>&1

# Install required dependencies
echo "Installing required dependencies..."
pnpm add inquirer@^9.0.0 >/dev/null 2>&1
pnpm add -D degit >/dev/null 2>&1

# Download the generate-portfolio.js script and related files from https://github.com/levelup-apps/generate-portfolio using degit
degit levelup-apps/generate-portfolio >/dev/null 2>&1

# Run the Node.js script
node generate-portfolio.js

# Cleanup
cd - >/dev/null
rm -rf "$TEMP_DIR"