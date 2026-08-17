# Stage 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend application
RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# We don't need to copy nginx.conf here since it's mounted in docker-compose.yml
# Expose port 80 internally
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
