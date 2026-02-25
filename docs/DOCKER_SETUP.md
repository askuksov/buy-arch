# Docker Setup Guide

This project uses Docker and Docker Compose for a consistent development environment with **separate configurations** for development and production.

## Prerequisites

- Docker installed and running
- Docker Compose installed
- Make installed (for Makefile commands)

## Quick Start

### 1. Clone and Setup

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Copy and update .env file
cp .env.example .env
# Add the generated NEXTAUTH_SECRET to .env
```

### 2. Initialize Project (First Time)

```bash
make init
```

This will:
- Create .env from .env.example (if needed)
- Start Docker containers (PostgreSQL + Next.js)
- Install dependencies
- Generate Prisma Client
- Run initial migration

### 3. Access the Application

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (database UI, auto-exposed in dev mode)

## Docker Compose Files

### Production (Default): `docker-compose.yml`
- Multi-stage optimized build
- Production environment variables
- Configurable ports and credentials
- Health checks for both services
- Dedicated network isolation
- Used by default with `docker-compose` command

### Development: `docker-compose.local.yml`
- Hot reload enabled with bind mounts
- Prisma Studio port exposed (5555)
- Development-optimized settings
- Node modules cached in volume
- Requires `-f docker-compose.local.yml` flag

## Common Commands

### Development

```bash
make dev          # Start development environment
make down         # Stop all containers
make restart      # Restart containers
make logs         # View all logs
make logs-app     # View app logs only
make logs-db      # View database logs only
make status       # Show container status
```

### Database

```bash
make migrate              # Run migrations (dev)
make migrate-create       # Create new migration
make migrate-deploy       # Deploy migrations (production)
make migrate-reset        # Reset database (deletes all data!)
make prisma-studio        # Open Prisma Studio
make prisma-generate      # Generate Prisma Client
make seed                 # Seed database
make shell-db             # Open PostgreSQL shell (dev)
make shell-db-prod        # Open PostgreSQL shell (prod)
```

### Production

```bash
make build        # Build production image
make up           # Start production containers
make logs-prod    # View production logs
```

### Utilities

```bash
make install      # Install dependencies
make clean        # Clean up everything (containers, volumes, images)
make shell-app    # Open shell in app container (dev)
make help         # Show all available commands
```

## Project Structure

```
.
├── Dockerfile                 # Production container configuration
├── docker-compose.yml         # Production services (default)
├── docker-compose.local.yml   # Development services configuration
├── Makefile                   # Development commands
├── .dockerignore              # Files to exclude from Docker build
├── .env.example               # Development environment template
├── .env.prod.example          # Production environment template
└── .env                       # Your local environment variables (git-ignored)
```

## Container Services

### PostgreSQL (postgres)

#### Development
- **Image**: postgres:16-alpine
- **Container**: purchase-organizer-db
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: purchase_organizer
- **Data**: Volume `postgres_data`

#### Production
- **Image**: postgres:16-alpine
- **Container**: purchase-organizer-db-prod
- **Port**: Configurable (default 5432)
- **User**: Configurable via `POSTGRES_USER`
- **Password**: **Required** via `POSTGRES_PASSWORD`
- **Database**: Configurable via `POSTGRES_DB`
- **Data**: Volume `postgres_data_prod`

### Next.js App

#### Development (app)
- **Image**: node:24-alpine
- **Container**: purchase-organizer-dev
- **Port**: 3000 (app), 5555 (Prisma Studio)
- **Hot Reload**: Enabled via bind mounts
- **Node Modules**: Cached in volume
- **Dependencies**: Auto-installed on start

#### Production (app)
- **Image**: Custom build from Dockerfile
- **Container**: purchase-organizer-app-prod
- **Port**: Configurable (default 3000)
- **Optimization**: Multi-stage build
- **Health Check**: Built-in endpoint monitoring
- **Network**: Isolated bridge network

## Development Workflow

1. **Start development environment**:
   ```bash
   make dev
   ```

2. **Make code changes** (hot reload is enabled)

3. **Run migrations** (when schema changes):
   ```bash
   make migrate
   ```

4. **View logs** (if needed):
   ```bash
   make logs
   ```

5. **Open Prisma Studio** (database GUI):
   ```bash
   make prisma-studio
   # Visit http://localhost:5555
   ```

6. **Stop when done**:
   ```bash
   make down
   ```

## Production Deployment

### 1. Prepare Production Environment

```bash
# Copy production environment template
cp .env.prod.example .env.prod

# Edit .env.prod and set:
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - POSTGRES_PASSWORD (strong password!)
# - NEXTAUTH_URL (your domain)
```

### 2. Build Production Image

```bash
make build
```

### 3. Deploy

```bash
# Start production containers
make up

# Run migrations
make migrate-deploy
```

### 4. Monitor

```bash
# Check status
make status

# View logs
make logs-prod
```

## Environment Variables

### Development (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | NextAuth secret key | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection | Auto-configured |

### Production (.env.prod)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Public domain URL | Yes |
| `POSTGRES_USER` | Database user | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `POSTGRES_DB` | Database name | Optional |
| `POSTGRES_PORT` | Database port | Optional |
| `APP_PORT` | Application port | Optional |

## Troubleshooting

### Containers won't start
```bash
make down
make dev
```

### Port conflicts
If port 3000 or 5432 is already in use:

**Development**: Edit `docker-compose.local.yml`:
```yaml
ports:
  - "3001:3000"  # Change external port
```

**Production**: Set in `.env.prod`:
```env
APP_PORT=3001
POSTGRES_PORT=5433
```

### Database issues
```bash
# View database logs
make logs-db

# Reset database (WARNING: deletes all data)
make migrate-reset

# Open database shell for manual inspection
make shell-db
```

### Dependency issues
```bash
# Reinstall dependencies
make install
```

### Clean slate
```bash
# Complete reset (WARNING: deletes all data)
make clean
make init
```

### Production troubleshooting
```bash
# Check production logs
make logs-prod

# Access production app shell
make shell-app-prod

# Access production database
make shell-db-prod
```

## Direct Docker Commands

If you prefer direct Docker commands:

### Development
```bash
# Start
docker compose -f docker-compose.local.yml up -d

# Stop
docker compose -f docker-compose.local.yml down

# Logs
docker compose -f docker-compose.local.yml logs -f

# Execute command
docker compose -f docker-compose.local.yml exec app npm install
```

### Production
```bash
# Build
docker compose build

# Start
docker compose up -d

# Stop
docker compose down

# Logs
docker compose logs -f
```

## Notes

### Development
- All data persists in Docker volumes
- Uploaded images stored in `./public/uploads` (bind mount)
- Node modules cached in volume for faster rebuilds
- Hot reload enabled for immediate feedback
- Prisma Studio automatically accessible

### Production
- Multi-stage build optimizes image size
- Health checks ensure service reliability
- Dedicated network for service isolation
- Environment variables for configuration
- Ready for deployment with minimal changes

## Security Notes

### Development
- Default credentials are acceptable for local development
- Database exposed on localhost only

### Production
- **CHANGE ALL DEFAULT PASSWORDS!**
- Use strong `POSTGRES_PASSWORD`
- Use HTTPS for `NEXTAUTH_URL`
- Don't expose PostgreSQL port publicly
- Use environment variables, never hardcode secrets
- Consider using Docker secrets for sensitive data

## Getting Help

```bash
make help
```

This shows all available commands with descriptions.

For more information:
- [Quick Start Guide](QUICK_START.md)
- [Main README](../README.md)
