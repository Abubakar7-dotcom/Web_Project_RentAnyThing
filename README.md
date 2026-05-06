# RentIt - Peer-to-Peer Rental Marketplace

A full-stack rental marketplace platform where users can list items for rent, discover and rent items from others, communicate in real-time, make payments, and leave reviews.

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite** - Fast, modern development
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication (HTTP-only cookies)
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing
- **Jest** + **Supertest** - Testing

## 📋 Features

### ✅ Completed (Tasks 1, 2 & 3)

#### Frontend (Task 1)
- 🎨 Complete UI with all pages and routing
- 🏠 Landing page with hero, stats, and featured products
- 🔐 Authentication pages (Login/Sign Up)
- 📊 Dashboard with search and product grid
- 🏷️ Categories and Popular pages
- 📝 Product detail pages with Q&A and reviews
- ⚙️ Settings page (Profile, Security, Notifications, Payment)
- 💬 Chat interface
- 👨‍💼 Admin panel (Dashboard, Users, Complaints)
- 🛒 Cart system with slide-in panel
- 📱 Fully responsive design
- ✨ Smooth animations and hover effects

#### Backend (Task 2)
- 🗄️ PostgreSQL database setup
- 📐 Complete Prisma schema (9 models)
- 🌱 Database seeding with sample data
- 🚀 Express server with Socket.io
- 🔌 API placeholder routes
- 📚 Comprehensive documentation

#### Authentication System (Task 3) ✅
- 🔐 User registration with validation
- 🔑 Login with JWT tokens (HTTP-only cookies)
- 🚪 Logout functionality
- 📧 Password reset via email
- ⏰ "Remember Me" feature (30 days vs 30 minutes)
- ⏱️ Inactivity timeout (30 minutes)
- 🛡️ Bcrypt password hashing (cost factor 10)
- ✅ 19/19 backend tests passing
- 🔒 Secure authentication with HTTP-only cookies
- 🚫 Email enumeration prevention
- 👤 Account deactivation support

### 🚧 In Progress

**Next up: Task 4 - Listings CRUD API**

### 📅 Upcoming Features

- **Task 4**: Listings CRUD API & Frontend Wiring
- **Task 5**: Rentals & Payments
- **Task 6**: Real-Time Chat & AI Chatbot
- **Task 7**: Reviews, Q&A & Complaints
- **Task 8**: Admin Panel
- **Task 9**: Settings, Performance & Testing

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Abubakar7-dotcom/Web_Project_RentAnyThing.git
cd Web_Project_RentAnyThing
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update with your PostgreSQL credentials
cp .env.example .env

# Create databases
# Connect to PostgreSQL and run:
# CREATE DATABASE rentit;
# CREATE DATABASE rentit_test;

# Run migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Seed the database
npm run prisma:seed

# Start the backend server
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: http://localhost:5173

## 🔑 Test Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@rentit.com / Password123
- **User**: john@example.com / Password123

## 📁 Project Structure

```
Web_Project_RentAnyThing/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── validators/      # Input validation
│   │   ├── utils/           # Utility functions
│   │   └── socket/          # Socket.io handlers
│   ├── prisma/              # Database schema & migrations
│   └── __tests__/           # Test files
│
└── .kiro/                    # Spec files
    └── specs/
        └── rent-anything-platform/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## 🎨 Design System

- **Primary Color**: #2563EB (Blue)
- **Accent Color**: #F97316 (Orange)
- **Background**: #F8FAFC
- **Foreground**: #1E293B
- **Border Radius**: 0.75rem

## 📊 Database Schema

### Models
- **User** - User accounts with authentication
- **Listing** - Rental items
- **Media** - Listing images/videos
- **Rental** - Rental agreements
- **Payment** - Payment records
- **Message** - Chat messages
- **Complaint** - User complaints
- **Review** - Listing reviews
- **QA** - Questions & Answers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (coming soon)
cd frontend
npm test
```

## 📝 API Documentation

### Available Endpoints

- `GET /health` - Health check ✅
- `POST /api/auth/register` - User registration (Task 3)
- `POST /api/auth/login` - User login (Task 3)
- `POST /api/auth/logout` - User logout (Task 3)
- `POST /api/auth/forgot-password` - Password reset request (Task 3)
- `POST /api/auth/reset-password` - Password reset (Task 3)

More endpoints will be added in subsequent tasks.

## 🤝 Contributing

This is a learning project. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

**Abubakar**
- GitHub: [@Abubakar7-dotcom](https://github.com/Abubakar7-dotcom)

## 🙏 Acknowledgments

- Built with modern web technologies
- Follows industry best practices
- Implements secure authentication patterns
- Uses property-based testing for correctness

---

**Status**: 🚀 Active Development - Tasks 1, 2 & 3 Complete (Authentication System Live!)
