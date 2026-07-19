# EchoShield AI Crime Detection

EchoShield is a full-stack AI-powered safety platform for automatic crime detection, evidence collection, geofencing, GPS tracking, and incident response.

## Features
- Scream detection service
- Automatic camera recording workflow
- Notification module
- Cloud evidence storage
- Geofencing and GPS tracking
- Dashboard and authentication
- Zoho Catalyst integration hooks

## Architecture
- Frontend: React + Vite
- Backend: Express.js
- Storage: local evidence directory for MVP
- Deployment: Docker and Docker Compose

## Run locally
1. Install dependencies:
   - npm install
   - cd frontend && npm install
   - cd backend && npm install
2. Start backend:
   - cd backend && npm run dev
3. Start frontend:
   - cd frontend && npm run dev
4. Open http://localhost:3000

## Environment
Copy backend/.env.example to backend/.env and adjust values.

## Deployment
- Docker: docker build -t echoshield .
- Compose: docker compose up --build
