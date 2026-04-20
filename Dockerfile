# Root Dockerfile to fix Cloud Build pathing
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 5000
CMD ["node", "src/index.js"]
