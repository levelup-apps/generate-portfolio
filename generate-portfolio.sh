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



# Install required dependencies
echo "Installing required dependencies..."
pnpm i

# Run the Node.js script
node generate-portfolio.js

cd my-portfolio
echo $PWD

git init
git add .
git commit -qm "Initial commit"

gh repo create my-portfolio --public --source .
git branch -M main
git push -uq origin main

echo "Your portfolio is available in your GitHub profile."

# https://bolt.new/~/github.com/georgeck/my-portfolio