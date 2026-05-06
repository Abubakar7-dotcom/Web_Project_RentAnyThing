# Database Setup Guide

## Prerequisites

You need PostgreSQL installed and running on your system.

### Installing PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use: `winget install PostgreSQL.PostgreSQL`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Quick Setup Steps

### 1. Create Database

Connect to PostgreSQL and create the databases:

```bash
# Connect to PostgreSQL (default user is usually 'postgres')
psql -U postgres

# In the PostgreSQL prompt:
CREATE DATABASE rentit;
CREATE DATABASE rentit_test;

# Exit
\q
```

### 2. Update .env File

Edit `backend/.env` and update the `DATABASE_URL` with your actual credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/rentit"
DATABASE_URL_TEST="postgresql://postgres:your_password@localhost:5432/rentit_test"
```

Replace:
- `postgres` with your PostgreSQL username (if different)
- `your_password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port (if different)

### 3. Run Migrations

```bash
cd backend
npm run prisma:migrate
```

This will:
- Create all tables defined in `prisma/schema.prisma`
- Generate the Prisma Client

### 4. Seed the Database

```bash
npm run prisma:seed
```

This will populate your database with:
- 2 users (admin and regular user)
- 6 featured listings with images
- Sample data for testing

### 5. Verify Setup

Start the server:

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
📡 Socket.io is ready for connections
🌍 Environment: development
```

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

## Common Issues

### Issue: "password authentication failed"
**Solution**: Check your PostgreSQL password in the `.env` file

### Issue: "database does not exist"
**Solution**: Create the database using the SQL commands in step 1

### Issue: "connection refused"
**Solution**: Make sure PostgreSQL is running:
- Windows: Check Services
- macOS: `brew services list`
- Linux: `sudo systemctl status postgresql`

### Issue: "Prisma Client not generated"
**Solution**: Run `npm run prisma:generate`

## Alternative: Using Docker

If you prefer Docker:

```bash
# Start PostgreSQL in Docker
docker run --name rentit-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rentit \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rentit"
```

## Cloud Database Options

You can also use cloud PostgreSQL services:

- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app (Free tier available)
- **Heroku Postgres**: https://www.heroku.com/postgres

Just update the `DATABASE_URL` in `.env` with the connection string provided by your cloud service.

## Verification Checklist

- [ ] PostgreSQL is installed and running
- [ ] Databases `rentit` and `rentit_test` are created
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Migrations ran successfully (`npm run prisma:migrate`)
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Database seeded (`npm run prisma:seed`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint responds correctly

## Next Steps

Once your database is set up and the server is running:

1. The backend is ready for Task 3 (Authentication System)
2. You can connect the frontend to the backend API
3. All placeholder routes will be implemented in subsequent tasks

## Need Help?

If you encounter issues:
1. Check the error messages carefully
2. Verify PostgreSQL is running
3. Double-check your `.env` configuration
4. Review the Prisma documentation: https://www.prisma.io/docs
