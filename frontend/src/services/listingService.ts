import api from './api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  category: string;
  location: string;
  isAvailable: boolean;
  isFeatured: boolean;
  ownerId: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
  };
  media: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      name: string;
    };
  }>;
  qas?: Array<{
    id: string;
    question: string;
    answer: string | null;
    answeredBy: string | null;
    createdAt: string;
    asker: {
      name: string;
    };
  }>;
}

export interface GetListingsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  pricePerDay: number;
  category: string;
  location: string;
  depositAmount?: number;
  mediaUrls?: string[];
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  pricePerDay?: number;
  category?: string;
  location?: string;
  depositAmount?: number;
}

/**
 * Get listings with optional filters and pagination
 */
export async function getListings(params: GetListingsParams = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.search) searchParams.append('search', params.search);
  if (params.category) searchParams.append('category', params.category);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/listings?${queryString}` : '/listings';
  
  const response = await api.get(url);
  return response.data;
}

/**
 * Get a single listing by ID
 */
export async function getListing(id: string): Promise<Listing> {
  const response = await api.get(`/listings/${id}`);
  return response.data;
}

/**
 * Create a new listing
 */
export async function createListing(data: CreateListingData): Promise<Listing> {
  const response = await api.post('/listings', data);
  return response.data;
}

/**
 * Update an existing listing
 */
export async function updateListing(id: string, data: UpdateListingData): Promise<Listing> {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string): Promise<void> {
  await api.delete(`/listings/${id}`);
}