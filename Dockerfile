FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm install --omit=dev && cd frontend && npm install --omit=dev && cd ../backend && npm install --omit=dev
COPY . .
EXPOSE 3000 5000
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm run dev -- --host 0.0.0.0"]
