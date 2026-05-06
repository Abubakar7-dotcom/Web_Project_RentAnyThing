import api from './api';

export interface Complaint {
  id: string;
  reporterId: string;
  reportedUserId: string | null;
  listingId: string | null;
  description: string;
  status: 'OPEN' | 'RESOLVED';
  resolvedAt: string | null;
  createdAt: string;
  reporter?: {
    id: string;
    name: string;
  };
  reportedUser?: {
    id: string;
    name: string;
  } | null;
  listing?: {
    id: string;
    title: string;
  } | null;
}

/**
 * Submit a complaint
 */
export async function submitComplaint(data: {
  description: string;
  reportedUserId?: string;
  listingId?: string;
}): Promise<Complaint> {
  const response = await api.post('/complaints', data);
  return response.data;
}

/**
 * Get complaints submitted by the authenticated user
 */
export async function getComplaints(): Promise<Complaint[]> {
  const response = await api.get('/complaints');
  return response.data;
}
