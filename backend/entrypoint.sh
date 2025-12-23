#!/bin/sh
set -e

# Run migrations with Knex (proper format)
npx knex migrate:latest --knexfile knexfile.js
npx knex seed:run --knexfile knexfile.js || echo "Seeds optional"

echo "✅ Migrations complete"
npm start
