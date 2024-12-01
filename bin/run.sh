#!/usr/bin/env sh

DAY=$1

TS_FILE="src/$DAY.ts"

if [[ ! -f $TS_FILE ]]; then
  echo "Error: $TS_FILE not found!"
  exit 1
fi

npx tsc

node "dist/$DAY.js"
