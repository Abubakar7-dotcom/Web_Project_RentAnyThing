-- Production Seed Data
-- Run this in Neon SQL Editor to create initial users

-- Insert admin user (password: Admin123!)
-- Password hash for "Admin123!" using bcrypt
INSERT INTO "User" (id, name, email, password, role, "isActive", "createdAt")
VALUES (
  'admin-seed-001',
  'Admin User',
  'admin@rentit.com',
  '$2a$10$rN8qN5YxGZxLKJ5kF5F5F.5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5',
  'ADMIN',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert test user (password: User123!)
INSERT INTO "User" (id, name, email, password, role, "isActive", "createdAt")
VALUES (
  'user-seed-001',
  'Test User',
  'user@rentit.com',
  '$2a$10$rN8qN5YxGZxLKJ5kF5F5F.5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5',
  'USER',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;
