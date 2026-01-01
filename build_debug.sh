#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
echo "----------------------------------------"
echo "DEBUG: Node Version: $(node -v)"
echo "DEBUG: NPM Version: $(npm -v)"
echo "----------------------------------------"
npm run build
echo "DEBUG: Build command finished with exit code $?"
