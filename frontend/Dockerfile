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

# We need the VITE_BACKEND_URL for the build (Production URL)
# The user will change this in the docker-compose or .env
ARG VITE_BACKEND_URL=https://diegovelazquez.dev/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx config if we wanted one for the frontend service specifically
# But we'll use a main gateway instead.
# For now, just expose 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
