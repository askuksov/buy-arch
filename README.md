# Personal Purchase Organizer

A web application for organizing and tracking personal purchases from various online marketplaces (AliExpress, Temu, OLX, Rozetka). Built with Next.js, TypeScript, PostgreSQL, and Prisma.

## Features

- Authentication with NextAuth.js
- Purchase tracking and management
- Categories and tags for organization
- Image upload with drag-and-drop
- Advanced search and filtering
- Dashboard with statistics
- Multi-marketplace support (AliExpress, Temu, OLX, Rozetka)
- Multi-currency support (USD, EUR, UAH)

## Quick Start

```bash
# 1. Generate secret and setup environment
openssl rand -base64 32
cp .env.example .env
# Add NEXTAUTH_SECRET to .env

# 2. Initialize and run
make init

# 3. Access at http://localhost:3000
```

## Common Commands

```bash
make dev              # Start development
make down             # Stop containers
make logs             # View logs
make migrate          # Run migrations
make prisma-studio    # Open database UI
make help             # Show all commands
```

## Tech Stack

**Frontend:** Next.js 16, TypeScript, TailwindCSS, React Hook Form, Zod, TanStack Query
**Backend:** Next.js API Routes, Prisma ORM, PostgreSQL 16, NextAuth.js
**DevOps:** Docker, Docker Compose, Makefile

## Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - 5-minute setup
- **[Docker Guide](docs/DOCKER_SETUP.md)** - Detailed Docker usage and commands

## Project Structure

```
app/              # Next.js routes and API
components/       # React components
lib/              # Utilities
prisma/           # Database schema
docker-compose.*  # Docker configurations
Makefile          # Development commands
```

## Troubleshooting

```bash
make clean && make init    # Fresh start
make logs                  # Debug issues
```

For more help, see [Quick Start Guide](docs/QUICK_START.md) or run `make help`.
