# SmartFollow CRM Desktop Application

> Eesti keeles: vaata `README_et.md` (see fail asub samas kaustas)

## Overview
SmartFollow is a Customer Relationship Management (CRM) application designed to help businesses manage their interactions with customers and streamline their processes. This project aims to develop a desktop application using Electron and TypeScript, with a backend built on Node.js and PostgreSQL for data management.

## Project Structure
The project is organized into several key directories:

- **apps/desktop**: Contains the Electron desktop application.
- **apps/server**: Contains the Node.js backend server.
- **packages/shared**: Contains shared code and types used across the application.
- **docker**: Contains Docker configurations for the PostgreSQL database.
- **scripts**: Contains utility scripts for development and deployment.

## Technologies Used
- **Frontend**: Electron, React, TypeScript, CSS
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Package Management**: pnpm

## Development Plan

### Phase 1: Setup and Configuration (Weeks 1-2)
- Initialize the project repository and set up the directory structure.
- Create `package.json` files for both the desktop and server applications.
- Set up TypeScript configurations (`tsconfig.json`) for both applications.
- Configure ESLint for code quality.

### Phase 2: Frontend Development (Weeks 3-5)
- Develop the main HTML file (`public/index.html`) for the Electron application.
- Implement the main process (`src/main/main.ts`) to create the application window.
- Set up the preload script (`src/preload/preload.ts`) for secure communication.
- Build the React application in the renderer process (`src/renderer/index.tsx`).
- Create the main React component (`src/renderer/components/App.tsx`) and implement routing.
- Style the application using global CSS (`src/renderer/styles/global.css`).

### Phase 3: Backend Development (Weeks 6-8)
- Set up the Express server (`src/index.ts`) and configure middleware.
- Implement authentication logic in the controller (`src/controllers/authController.ts`).
- Define application routes (`src/routes/index.ts`) and link them to controllers.
- Develop user management services (`src/services/userService.ts`).
- Create the user model (`src/models/userModel.ts`) for database interactions.
- Write SQL migration scripts (`src/db/migrations/001_init.sql`) for database schema.
- Create seed scripts (`src/db/seed/seed_users.sql`) for initial data.

### Phase 4: Database and Docker Integration (Weeks 9-10)
- Create a Dockerfile for PostgreSQL (`docker/postgres/Dockerfile`).
- Write initialization scripts for the database (`docker/postgres/init.sql`).
- Test the database connection and ensure migrations and seeds work correctly.

### Phase 5: Testing and Deployment (Weeks 11-12)
- Write unit and integration tests for both frontend and backend components.
- Set up a development script (`scripts/start-dev.sh`) to run the applications.
- Prepare documentation for setup and usage in the main `README.md`.
- Conduct user testing and gather feedback for improvements.

## Estimated Timeline
- **Weeks 1-2**: Setup and Configuration
- **Weeks 3-5**: Frontend Development
- **Weeks 6-8**: Backend Development
- **Weeks 9-10**: Database and Docker Integration
- **Weeks 11-12**: Testing and Deployment

## Conclusion
This project plan outlines the steps necessary to develop the SmartFollow CRM desktop application. By following this plan, we aim to create a robust and user-friendly application that meets the needs of businesses in managing customer relationships effectively.