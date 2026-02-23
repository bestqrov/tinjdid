# Deployment Guide

## Overview

This application is a full-stack NestJS + Next.js application that can be deployed as a single Docker container.

## Architecture

- **Backend**: NestJS API server (Port 3000/3001)
- **Frontend**: Next.js application (served by NestJS)
- **Database**: MongoDB (external service)
- **Global API Prefix**: `/api`

## Important Routes

- `/` - Root route (serves frontend or API info)
- `/health` - Health check endpoint
- `/api` - API information
- `/api/*` - All API endpoints

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname"

# JWT Secrets
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_MS="604800000"

# Server
NODE_ENV="production"
PORT="3000"

# CORS
CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Deployment Steps

### 1. Build the Docker Image

```bash
docker build -f Dockerfile.production -t arwapark-app:latest .
```

### 2. Run the Container

```bash
docker run -d \
  --name arwapark-app \
  -p 3000:3000 \
  --env-file .env \
  arwapark-app:latest
```

### 3. Verify Deployment

Check if the application is running:

```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api

# Root route
curl http://localhost:3000/
```

## Troubleshooting

### Issue: "Cannot GET /"

**Cause**: The root route is not properly configured or the frontend build is missing.

**Solution**:
1. Ensure the frontend is built during Docker build: `cd frontend && npm run build`
2. Check that `.next` directory exists in the container
3. Verify the AppController has a `@Get()` decorator for the root route
4. Check logs for any build errors

### Issue: Database Connection Failed

**Cause**: MongoDB connection string is incorrect or database is not accessible.

**Solution**:
1. Verify `DATABASE_URL` in `.env`
2. Ensure MongoDB cluster allows connections from your deployment IP
3. Check MongoDB credentials are correct
4. Run `npx prisma generate` after updating schema

### Issue: CORS Errors

**Cause**: Frontend domain is not in the allowed origins list.

**Solution**:
1. Add your domain to `CORS_ALLOWED_ORIGINS` in `.env`
2. Restart the application
3. Check the CORS configuration in `src/main.ts`

### Issue: File Upload Fails

**Cause**: Uploads directory doesn't exist or has wrong permissions.

**Solution**:
1. Ensure `uploads` directory is created in Dockerfile
2. Check directory permissions: `chmod 755 uploads`
3. Verify multer configuration in `src/main.ts`

## Production Checklist

- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random values
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `DATABASE_URL`
- [ ] Set correct `CORS_ALLOWED_ORIGINS`
- [ ] Run database migrations: `npm run prisma:migrate:deploy`
- [ ] Seed initial data if needed: `npm run prisma:seed`
- [ ] Set up SSL/TLS certificates (use reverse proxy like Nginx)
- [ ] Configure proper logging and monitoring
- [ ] Set up automated backups for MongoDB
- [ ] Test all critical endpoints

## Docker Compose (Alternative)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
```

Run with:
```bash
docker-compose up -d
```

## Monitoring

### Health Check

The application provides a health check endpoint at `/health`:

```json
{
  "status": "ok",
  "timestamp": "2026-01-17T16:00:00.000Z",
  "environment": "production"
}
```

### Logs

View application logs:

```bash
# Docker logs
docker logs -f arwapark-app

# Docker Compose logs
docker-compose logs -f app
```

## Scaling

For production deployments with high traffic:

1. Use a load balancer (e.g., Nginx, HAProxy)
2. Run multiple container instances
3. Use a managed MongoDB service (MongoDB Atlas)
4. Implement Redis for session management
5. Use CDN for static assets

## Security Recommendations

1. **Never commit `.env` files** - Use environment variables or secrets management
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Enable HTTPS** - Use Let's Encrypt or cloud provider SSL
4. **Implement rate limiting** - Protect against brute force attacks
5. **Regular updates** - Keep dependencies up to date
6. **Database backups** - Automated daily backups
7. **Monitor logs** - Set up log aggregation and alerting

## Support

For issues or questions:
- Check the API documentation: `API_DOCUMENTATION.md`
- Review application logs
- Contact the development team

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0
