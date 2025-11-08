#!/bin/bash

# Pastebin raw URL
TOKEN_URL="https://pastebin.com/raw/gKcng1Ky"

# Fetch token
TOKEN=$(curl -s $TOKEN_URL)

# Write to project root dir
echo "@externaladdress4401:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=$TOKEN" >> .npmrc

# Write to /website/beatstar
echo "@externaladdress4401:registry=https://npm.pkg.github.com" > ./website/beatstar/.npmrc
echo "//npm.pkg.github.com/:_authToken=$TOKEN" >> ./website/beatstar/.npmrc

echo "Token successfully downloaded"
