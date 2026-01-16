# Next.js production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source code
COPY frontend .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY frontend/package*.json ./
RUN npm install --omit=dev

# Copy built app and static files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
