# Stage 1: Build the Vue/Vite application (Generic & Secure - Zero Secrets)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definitions for optimal Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and config files
COPY . .

# Build the generic production bundle
RUN npm run build

# Stage 2: Production Nginx Server with Runtime Environment Injection
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime entrypoint script to dynamically inject .env / environment variables
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
