#!/bin/sh
echo "Waiting for postgres to be ready..."
until pg_isready -h ddrs-postgres -U ddrs_user -d ddrs; do
  sleep 2
done

echo "Running seed scripts..."
psql -h ddrs-postgres -U ddrs_user -d ddrs -f /seed.sql

echo "Data loading complete! The container will now exit."
