#!/bin/sh
set -e

# Seed the JSON store on a cold start so the public demo always boots with the
# same example data. Writes during a session live in the container only and
# reset when the instance is recycled.
if [ ! -f /app/data/store.json ]; then
  mkdir -p /app/data
  cp /app/data/store.seed.json /app/data/store.json
fi

exec node server.js
