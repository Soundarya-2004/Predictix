# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
# Increase memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
