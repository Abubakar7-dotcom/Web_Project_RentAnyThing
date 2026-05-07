import api from './api';

export interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalRentals: number;
  activeRentals: number;
  totalRevenue: number;
  pendingComplaints: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  phone?: string;
  createdAt: string;
  _count?: {
    listings: number;
    rentals: number;
  };
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  phone?: string;
  isActive?: boolean;
  password?: string;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/admin/stats');
  return response.data;
}

/**
 * Get all users with pagination
 */
export async function getUsers(page: number = 1, limit: number = 20): Promise<UsersResponse> {
  const response = await api.get<UsersResponse>('/admin/users', {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<AdminUser> {
  const response = await api.post<{ user: AdminUser }>('/admin/users', data);
  return response.data.user;
}

/**
 * Update a user
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<AdminUser> {
  const response = await api.put<{ user: AdminUser }>(`/admin/users/${id}`, data);
  return response.data.user;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(id: string): Promise<AdminUser> {
  const response = await api.patch<{ user: AdminUser }>(`/admin/users/${id}/toggle-status`);
  return response.data.user;
}
