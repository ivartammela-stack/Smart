#!/bin/bash

# Start the PostgreSQL database using Docker
docker-compose -f docker/postgres/docker-compose.yml up -d

# Navigate to the server directory and install dependencies
cd apps/server
npm install

# Start the Node.js backend server
npm run dev &

# Navigate to the desktop application directory and install dependencies
cd ../desktop
npm install

# Start the Electron application
npm run start