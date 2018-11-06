#!/bin/bash

COLOR_BLUE='\033[0;34m'
COLOR_TRANSPARENT='\033[0m' # No Color

clear

echo -e "${COLOR_BLUE}[ 001 ]${COLOR_TRANSPARENT} - Starting production building"

npm run build

echo -e "${COLOR_BLUE}[ 002 ]${COLOR_TRANSPARENT} - Move resources folders (images, fonts etc.)"

cp -R ./src/fonts ./build
cp -R ./src/images ./build

echo -e "${COLOR_BLUE}[ END ]${COLOR_TRANSPARENT} - All done!"