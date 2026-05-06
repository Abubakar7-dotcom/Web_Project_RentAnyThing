# RentIt Backend

Backend API for the RentIt peer-to-peer rental marketplace platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (HTTP-only cookies)
- **Real-time**: Socket.io
- **Testing**: Jest + Supertest

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your actual values:

```bash
cp .env.example .env
```

**Important**: Update the following in your `.env` file:
- `DATABASE_URL`: Your PostgreSQL connection string
- `DATABASE_URL_TEST`: Your test database connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `EMAIL_*`: Your SMTP email configuration (for password reset emails)

### 3. Set Up Database

Make sure PostgreSQL is installed and running, then:

```bash
# Run migrations to create database schema
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Seed the database with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # HTTP server + Socket.io setup
│   ├── socket/
│   │   └── index.ts       # Socket.io event handlers
│   ├── controllers/       # Route controllers (coming in Task 3+)
│   ├── services/          # Business logic (coming in Task 3+)
│   ├── routes/            # API routes (coming in Task 3+)
│   ├── middlewares/       # Express middlewares (coming in Task 3+)
│   ├── validators/        # Input validation (coming in Task 3+)
│   └── utils/             # Utility functions (coming in Task 3+)
├── __tests__/             # Test files (coming in Task 3+)
└── package.json
```

## API Endpoints (Placeholder)

All routes currently return `501 Not Implemented`. They will be implemented in subsequent tasks:

- `/api/auth` - Authentication (Task 3)
- `/api/listings` - Listings CRUD (Task 4)
- `/api/rentals` - Rental management (Task 5)
- `/api/payments` - Payment processing (Task 5)
- `/api/messages` - Real-time chat (Task 6)
- `/api/complaints` - Complaint submission (Task 7)
- `/api/admin` - Admin panel (Task 8)
- `/api/chatbot` - AI chatbot (Task 6)

## Database Schema

The Prisma schema includes the following models:

- **User** - User accounts with authentication
- **Listing** - Rental items
- **Media** - Listing images/videos
- **Rental** - Rental agreements
- **Payment** - Payment records
- **Message** - Chat messages
- **Complaint** - User complaints
- **Review** - Listing reviews
- **QA** - Questions & Answers

See `prisma/schema.prisma` for the complete schema definition.

## Seed Data

The seed script creates:
- 2 users (1 admin, 1 regular user)
  - Admin: `admin@rentit.com` / `Password123`
  - User: `john@example.com` / `Password123`
- 8 categories (Electronics, Tools, Sports, Camping, Photography, Music, Vehicles, Party)
- 6 featured listings with images from Unsplash

## Testing

Tests will be added in subsequent tasks. Run tests with:

```bash
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `DATABASE_URL_TEST` | Test database connection string | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `30m` |
| `JWT_REMEMBER_EXPIRES_IN` | JWT expiration for "Remember Me" | `30d` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |
| `EMAIL_HOST` | SMTP host | - |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASS` | SMTP password | - |

## Next Steps

1. Configure your PostgreSQL database
2. Update `.env` with your database credentials
3. Run migrations and seed the database
4. Start the development server
5. Proceed to Task 3 to implement authentication

## Support

For issues or questions, please refer to the main project documentation.
