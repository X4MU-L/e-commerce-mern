# Docker Development Setup Guide

## MERN E-Commerce Application

This guide provides comprehensive instructions for setting up and running the MERN e-commerce application using Docker for local development.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Architecture](#docker-architecture)
3. [Quick Start](#quick-start)
4. [Detailed Setup](#detailed-setup)
5. [Docker Configuration Files](#docker-configuration-files)
6. [Development Workflow](#development-workflow)
7. [Useful Docker Commands](#useful-docker-commands)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software

- **Docker Desktop** (latest version)
  - Download: https://www.docker.com/products/docker-desktop
  - Includes Docker Engine and Docker Compose
- **Git** (for cloning the repository)
- **Code Editor** (VS Code recommended)

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 10GB free
- **OS**: macOS, Windows 10/11, or Linux

### Verify Installation

```bash
# Check Docker version
docker --version
# Should output: Docker version 20.x.x or higher

# Check Docker Compose version
docker-compose --version
# Should output: Docker Compose version 2.x.x or higher

# Verify Docker is running
docker ps
# Should show empty list or running containers
```

---

## Docker Architecture

### Container Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                   (mern-network)                         │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   Frontend       │  │   Backend        │            │
│  │   Container      │  │   Container      │            │
│  │                  │  │                  │            │
│  │  - React App     │  │  - Express API   │            │
│  │  - Port: 3000    │◄─┤  - Port: 8000    │            │
│  │  - Volume: ./src │  │  - Volume: ./    │            │
│  └──────────────────┘  └──────────────────┘            │
│                                 │                         │
│                                 ▼                         │
│                    ┌──────────────────┐                  │
│                    │   MongoDB        │                  │
│                    │   Container      │                  │
│                    │                  │                  │
│                    │  - Port: 27017   │                  │
│                    │  - Volume: data  │                  │
│                    └──────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

### Services

1. **MongoDB** - Database service
2. **Backend** - Node.js/Express API
3. **Frontend** - React application

---

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd mern-ecommerce
```

### 2. Create Environment Files

Create `backend/.env`:

```env
MONGO_URI=mongodb://mongo:27017/ecommerce
SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
COOKIE_EXPIRATION_DAYS=7
PRODUCTION=false
ORIGIN=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Create `frontend/.env`:

```env
REACT_APP_BASE_URL=http://localhost:8000
```

### 3. Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

### 5. Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

---

## Detailed Setup

### Step 1: Project Structure Setup

Ensure your project has this structure:

```
mern-ecommerce/
├── docker-compose.yml          # Multi-container orchestration
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── .env                   # Backend environment variables
│   ├── .dockerignore          # Files to exclude from build
│   ├── package.json
│   └── [other backend files]
└── frontend/
    ├── Dockerfile             # Frontend container config
    ├── .env                   # Frontend environment variables
    ├── .dockerignore          # Files to exclude from build
    ├── package.json
    └── [other frontend files]
```

### Step 2: Create Docker Configuration Files

#### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start application in development mode
CMD ["npm", "run", "dev"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
```

#### Docker Compose Configuration

Create `docker-compose.yml` in root directory:

```yaml
version: "3.8"

services:
  # MongoDB Database
  mongo:
    image: mongo:7.0
    container_name: mern-ecommerce-db
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=ecommerce
    networks:
      - mern-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mern-ecommerce-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    env_file:
      - ./backend/.env
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - mern-network
    command: npm run dev

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mern-ecommerce-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
    networks:
      - mern-network
    stdin_open: true
    tty: true

networks:
  mern-network:
    driver: bridge

volumes:
  mongo-data:
    driver: local
```

#### Backend .dockerignore

Create `backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.DS_Store
coverage
.vscode
```

#### Frontend .dockerignore

Create `frontend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.DS_Store
build
coverage
.vscode
```

### Step 3: Environment Configuration

#### Backend Environment Variables (`backend/.env`)

```env
# Database
MONGO_URI=mongodb://mongo:27017/ecommerce

# JWT Configuration
SECRET_KEY=your_super_secret_jwt_key_min_32_chars_long
COOKIE_EXPIRATION_DAYS=7

# Environment
PRODUCTION=false
NODE_ENV=development

# CORS
ORIGIN=http://localhost:3000

# Email Configuration (for OTP and password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Optional: For production
# PRODUCTION=true
# ORIGIN=https://your-frontend-domain.com
```

**Important Notes**:

- `MONGO_URI` uses service name `mongo` (Docker DNS)
- `EMAIL_PASS` should be an app-specific password (not your regular password)
- For Gmail: Enable 2FA and create app password at https://myaccount.google.com/apppasswords

#### Frontend Environment Variables (`frontend/.env`)

```env
# Backend API URL
REACT_APP_BASE_URL=http://localhost:8000

# Optional: For production
# REACT_APP_BASE_URL=https://your-backend-domain.com
```

---

## Docker Configuration Files

### Complete docker-compose.yml Breakdown

```yaml
version: "3.8" # Docker Compose file format version

services:
  # ===== MongoDB Service =====
  mongo:
    image: mongo:7.0 # Official MongoDB image
    container_name: mern-ecommerce-db
    restart: unless-stopped # Auto-restart on failure
    ports:
      - "27017:27017" # Map host:container ports
    volumes:
      - mongo-data:/data/db # Persist database data
    environment:
      - MONGO_INITDB_DATABASE=ecommerce
    networks:
      - mern-network # Custom network for inter-service communication
    healthcheck: # Check if MongoDB is ready
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # ===== Backend Service =====
  backend:
    build:
      context: ./backend # Build from backend directory
      dockerfile: Dockerfile
    container_name: mern-ecommerce-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app # Mount code for hot-reload
      - /app/node_modules # Prevent overwriting node_modules
    environment:
      - NODE_ENV=development
    env_file:
      - ./backend/.env # Load environment variables
    depends_on:
      mongo:
        condition: service_healthy # Wait for MongoDB to be ready
    networks:
      - mern-network
    command: npm run dev # Use nodemon for hot-reload

  # ===== Frontend Service =====
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mern-ecommerce-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true # Enable file watching in Docker
      - WATCHPACK_POLLING=true
    env_file:
      - ./frontend/.env
    depends_on:
      - backend # Wait for backend
    networks:
      - mern-network
    stdin_open: true # Required for React
    tty: true

# ===== Networks =====
networks:
  mern-network:
    driver: bridge # Bridge network for container communication

# ===== Volumes =====
volumes:
  mongo-data: # Named volume for database persistence
    driver: local
```

---

## Development Workflow

### Starting Development

#### Option 1: Full Stack (Recommended)

```bash
# Start all services
docker-compose up

# Or in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Option 2: Individual Services

```bash
# Start only database
docker-compose up mongo

# Start backend (requires mongo)
docker-compose up backend

# Start frontend
docker-compose up frontend
```

### Code Changes and Hot Reload

**Backend Changes**:

- Edit files in `backend/` directory
- Nodemon automatically restarts server
- Changes reflect immediately

**Frontend Changes**:

- Edit files in `frontend/src/` directory
- React hot module replacement (HMR) applies changes
- Browser auto-refreshes

### Accessing Services

#### Via Browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Test backend: http://localhost:8000/ (should show `{"message":"running"}`)

#### Via Docker CLI

```bash
# Execute commands in backend container
docker-compose exec backend npm run seed

# Execute commands in frontend container
docker-compose exec frontend npm test

# Access MongoDB shell
docker-compose exec mongo mongosh ecommerce
```

### Database Management

#### Seed Database

```bash
# Run seed script
docker-compose exec backend npm run seed
```

#### Access MongoDB Shell

```bash
# Connect to MongoDB
docker-compose exec mongo mongosh ecommerce

# Inside MongoDB shell
> show collections
> db.users.find()
> db.products.find()
> exit
```

#### Backup Database

```bash
# Create backup
docker-compose exec mongo mongodump --db=ecommerce --out=/data/backup

# Copy backup to host
docker cp mern-ecommerce-db:/data/backup ./mongodb-backup
```

#### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb-backup mern-ecommerce-db:/data/restore

# Restore
docker-compose exec mongo mongorestore --db=ecommerce /data/restore/ecommerce
```

### Installing New Packages

#### Backend

```bash
# Install package
docker-compose exec backend npm install package-name

# Or rebuild container
docker-compose up --build backend
```

#### Frontend

```bash
# Install package
docker-compose exec frontend npm install package-name

# Or rebuild container
docker-compose up --build frontend
```

---

## Useful Docker Commands

### Container Management

```bash
# List running containers
docker-compose ps

# Stop all containers
docker-compose stop

# Start stopped containers
docker-compose start

# Restart all containers
docker-compose restart

# Restart specific service
docker-compose restart backend

# Remove all containers
docker-compose down

# Remove containers and volumes (⚠️ deletes data)
docker-compose down -v

# Remove containers and images
docker-compose down --rmi all
```

### Building and Rebuilding

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache (clean build)
docker-compose build --no-cache

# Build and start
docker-compose up --build
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Logs for specific service
docker-compose logs backend

# Last 100 lines
docker-compose logs --tail=100

# Logs with timestamps
docker-compose logs -t
```

### Executing Commands

```bash
# Run command in backend
docker-compose exec backend npm run dev

# Run command in frontend
docker-compose exec frontend npm test

# Access bash shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Run one-off command
docker-compose run backend npm run seed
```

### Resource Monitoring

```bash
# View resource usage
docker stats

# Inspect container
docker inspect mern-ecommerce-backend

# View network
docker network inspect mern-ecommerce_mern-network

# View volume
docker volume inspect mern-ecommerce_mongo-data
```

### Cleanup

```bash
# Remove stopped containers
docker-compose rm

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused (⚠️ careful!)
docker system prune -a --volumes
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:

```bash
# Find process using port
lsof -i :3000   # macOS/Linux
netstat -ano | findstr :3000   # Windows

# Kill process or change port in docker-compose.yml
ports:
  - "3001:3000"  # Map host port 3001 to container port 3000
```

#### 2. Database Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:

```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo

# Ensure MONGO_URI uses service name 'mongo'
MONGO_URI=mongodb://mongo:27017/ecommerce

# Restart services with dependency check
docker-compose down
docker-compose up --build
```

#### 3. Frontend Cannot Connect to Backend

**Error**: Network errors or CORS issues

**Solutions**:

```bash
# Verify backend is running
curl http://localhost:8000

# Check CORS settings in backend .env
ORIGIN=http://localhost:3000

# Ensure both services are on same network
docker-compose exec frontend ping backend
```

#### 4. Hot Reload Not Working

**Solution**:

```yaml
# Add to frontend service in docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
volumes:
  - ./frontend:/app
  - /app/node_modules # Important: prevents node_modules override
```

#### 5. Permission Denied Errors

**Solution**:

```bash
# Fix ownership (macOS/Linux)
sudo chown -R $USER:$USER .

# Or run Docker commands with sudo
sudo docker-compose up
```

#### 6. Out of Memory

**Solution**:

- Increase Docker Desktop memory allocation
- Settings → Resources → Memory (set to at least 4GB)

#### 7. Build Fails with Package Errors

**Solution**:

```bash
# Clear Docker cache
docker-compose build --no-cache

# Remove node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
docker-compose up --build
```

#### 8. Environment Variables Not Loading

**Solution**:

```bash
# Check .env file location and format
cat backend/.env

# Ensure no spaces around = in .env
# WRONG: SECRET_KEY = abc123
# RIGHT: SECRET_KEY=abc123

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Debugging Tips

#### Check Container Status

```bash
# Are containers running?
docker-compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' mern-ecommerce-db
```

#### View Container Logs

```bash
# Real-time logs
docker-compose logs -f backend

# Search logs for errors
docker-compose logs backend | grep -i error
```

#### Access Container Shell

```bash
# Backend shell
docker-compose exec backend sh

# Inside shell, check environment
echo $MONGO_URI
ls -la
ps aux
```

#### Test Network Connectivity

```bash
# From backend to mongo
docker-compose exec backend ping mongo

# From frontend to backend
docker-compose exec frontend ping backend

# Check DNS resolution
docker-compose exec backend nslookup mongo
```

#### Verify Environment Variables

```bash
# Backend
docker-compose exec backend printenv | grep MONGO

# Frontend
docker-compose exec frontend printenv | grep REACT_APP
```

---

## Production Deployment

### Production Docker Setup

#### Production Dockerfile (Backend)

Create `backend/Dockerfile.prod`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

#### Production Dockerfile (Frontend)

Create `frontend/Dockerfile.prod`:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  mongo:
    image: mongo:7.0
    restart: always
    volumes:
      - mongo-data-prod:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    networks:
      - mern-network-prod

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    env_file:
      - ./backend/.env.production
    depends_on:
      - mongo
    networks:
      - mern-network-prod

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - mern-network-prod

networks:
  mern-network-prod:
    driver: bridge

volumes:
  mongo-data-prod:
```

#### Production Environment

Create `backend/.env.production`:

```env
MONGO_URI=mongodb://mongo:27017/ecommerce
SECRET_KEY=<strong-random-key-min-64-chars>
COOKIE_EXPIRATION_DAYS=7
PRODUCTION=true
ORIGIN=https://yourdomain.com
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=<app-password>
```

#### Deploy to Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Cloud Deployment Options

#### 1. Docker Hub + VPS

```bash
# Build and tag images
docker build -t yourusername/ecommerce-backend:latest ./backend
docker build -t yourusername/ecommerce-frontend:latest ./frontend

# Push to Docker Hub
docker push yourusername/ecommerce-backend:latest
docker push yourusername/ecommerce-frontend:latest

# On VPS, pull and run
docker pull yourusername/ecommerce-backend:latest
docker-compose up -d
```

#### 2. AWS ECS

- Use AWS Elastic Container Service
- Upload images to Amazon ECR
- Define task definitions
- Create ECS service

#### 3. Google Cloud Run

- Build images with Cloud Build
- Deploy to Cloud Run
- Configure Cloud SQL for MongoDB alternative

#### 4. Heroku Container Registry

```bash
# Login to Heroku
heroku container:login

# Push images
heroku container:push web -a your-app-name

# Release
heroku container:release web -a your-app-name
```

---

## Best Practices

### Development

1. **Use volumes** for code mounting (enables hot reload)
2. **Separate node_modules** volume to prevent overwrite
3. **Use .dockerignore** to exclude unnecessary files
4. **Enable polling** for file watching in containers
5. **Check logs regularly** for errors and warnings

### Production

1. **Use multi-stage builds** to reduce image size
2. **Run as non-root user** in containers
3. **Use secrets management** for sensitive data
4. **Enable health checks** for all services
5. **Implement proper logging** and monitoring
6. **Use reverse proxy** (nginx) for frontend
7. **Set resource limits** for containers
8. **Regular backups** of database volumes

### Security

1. **Never commit .env files** to git
2. **Use strong secrets** for JWT and passwords
3. **Enable HTTPS** in production
4. **Restrict network access** appropriately
5. **Keep images updated** to patch vulnerabilities
6. **Use official base images** only
7. **Scan images** for vulnerabilities

---

## Additional Resources

### Official Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

### Learning Resources

- [Docker for Developers](https://docs.docker.com/get-started/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)
- [Dockerizing Node.js Applications](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## Summary

You now have a complete Docker development environment for the MERN e-commerce application:

✅ **MongoDB**: Persistent database with health checks  
✅ **Backend**: Node.js API with hot reload  
✅ **Frontend**: React app with live updates  
✅ **Networking**: Isolated Docker network  
✅ **Development**: Efficient workflow with Docker Compose  
✅ **Production**: Deployment-ready configurations

### Quick Commands Reference

```bash
# Start development
docker-compose up

# Stop development
docker-compose down

# Rebuild everything
docker-compose up --build

# View logs
docker-compose logs -f

# Access shell
docker-compose exec backend sh

# Seed database
docker-compose exec backend npm run seed
```

**Happy Dockerizing! 🐳**
