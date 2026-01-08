# ===========================
# Build stage
# ===========================
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript project
RUN npm run build

# ===========================
# Production stage
# ===========================
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy other necessary files (Prisma, migrations, etc.)
COPY prisma ./prisma

# Create runtime folders
RUN mkdir -p uploads/contracts uploads/vehicles

# Set non-root user
USER node

# Expose port
EXPOSE 3000

# Optional: Healthcheck for cloud platforms
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/src/main.js"]

# Start application
CMD ["node", "dist/main.js"]
