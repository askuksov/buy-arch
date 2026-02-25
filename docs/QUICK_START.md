# Quick Start Guide

## First Time Setup (5 minutes)

### 1. Generate Secret Key
```bash
openssl rand -base64 32
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and add your `NEXTAUTH_SECRET`

### 3. Initialize Project
```bash
make init
```
Wait 2-3 minutes while Docker sets everything up

### 4. Access Your App

- **App**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

---

## Daily Development

### Start Working
```bash
make dev
```

### View Logs
```bash
make logs
```

### Stop When Done
```bash
make down
```

---

## Database Commands

### Run Migrations
```bash
make migrate
```

### Open Database UI
```bash
# Prisma Studio (ORM interface)
make prisma-studio  # http://localhost:5555
```

### Reset Database (WARNING: Deletes All Data)
```bash
make migrate-reset
```

---

## Troubleshooting

### Something Broken?
```bash
make down
make dev
```

### Need Fresh Start?
```bash
make clean
make init
```

---

## All Commands

```bash
make help
```

---

## Need Help?

Read [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed documentation
