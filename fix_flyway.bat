docker exec cdsco_demo-ddrs-postgres-1 psql -U ddrs_user -d ddrs_identity -c "DELETE FROM flyway_schema_history WHERE version='2';"
docker-compose up -d --build identity-service
