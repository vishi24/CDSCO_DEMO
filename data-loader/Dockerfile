FROM postgres:16-alpine

# Set environment variables for the Postgres client
ENV PGPASSWORD=ddrs_secret

# Copy the seed script and an entrypoint wrapper
COPY seed.sql /seed.sql
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# The entrypoint will attempt to connect to ddrs-postgres and run seed.sql
ENTRYPOINT ["/entrypoint.sh"]
