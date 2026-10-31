# Multi-stage Docker build for QuestFlow AI (Production Google Cloud Run)

# 1. Build Client Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci || npm install
COPY client/ ./
RUN npm run build

# 2. Production Runtime Image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production || npm install --production

# Copy server source code
COPY server/ ./

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/client/dist /app/client/dist

# Expose standard Cloud Run port
EXPOSE 8080

# Launch server
CMD ["node", "src/server.js"]
