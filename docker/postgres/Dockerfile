# Use specific version instead of 'latest' for reproducibility
FROM postgres:14-alpine

# Use build args (can be overridden at build time)
# Never hardcode passwords in Dockerfile!
ARG POSTGRES_USER=smartfollow
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB=smartfollow_db

# Set ENV from build args
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# Run as non-root user (postgres user is created by base image)
USER postgres
