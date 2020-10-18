# !/bin/sh

set -euo pipefail

path="./src/*"

[[ ! -d ./lambda ]] && mkdir lambda

# Build:src
for dir in $path; do
  function=${dir##*/}

  mv ./src/$function/package.json ./dist/$function

  cd dist/$function
  npm i
  cd ../../
done

# Build:zipped
for dir in $path; do
  function=${dir##*/}

  cd dist
  zip -r ../lambda/$function.zip $function
  cd ..
done
