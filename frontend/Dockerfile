# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && \
    npm install --legacy-peer-deps && \
    apk del python3 make g++

# Copy source and build
COPY . .

# We need these variables for the build (Production URLs)
ARG VITE_BACKEND_URL
ARG VITE_SITE_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy a custom nginx config if we wanted one for the frontend service specifically
# But we'll use a main gateway instead.
# For now, just expose 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
