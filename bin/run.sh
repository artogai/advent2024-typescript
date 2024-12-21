#!/usr/bin/env sh

DAYNUM=$1

TS_FILE="src/day$DAYNUM.ts"

if [[ ! -f $TS_FILE ]]; then
  echo "Error: $TS_FILE not found!"
  exit 1
fi

npx tsc

node "dist/day$DAYNUM.js"
