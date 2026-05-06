import api from './api';

export interface CreateRentalData {
  listingId: string;
  startDate: string;
  endDate: string;
}

export interface Rental {
  id: string;
  listingId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  listing: {
    id: string;
    title: string;
    pricePerDay: number;
    media: Array<{
      id: string;
      url: string;
      type: string;
    }>;
    owner?: {
      id: string;
      name: string;
    };
  };
  borrower: {
    id: string;
    name: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: string;
  };
}

export const rentalService = {
  /**
   * Create a new rental
   */
  async createRental(data: CreateRentalData): Promise<Rental> {
    const response = await api.post('/rentals', data);
    return response.data;
  },

  /**
   * Get all rentals for the authenticated user
   */
  async getRentals(): Promise<Rental[]> {
    const response = await api.get('/rentals');
    return response.data;
  },

  /**
   * Get a specific rental
   */
  async getRental(id: string): Promise<Rental> {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  /**
   * Approve a rental (owner only)
   */
  async approveRental(id: string): Promise<Rental> {
    const response = await api.post(`/rentals/${id}/approve`);
    return response.data;
  },

  /**
   * Complete a rental (owner only)
   */
  async completeRental(id: string): Promise<Rental> {
    const response = await api.post(`/rentals/${id}/complete`);
    return response.data;
  },

  /**
   * Cancel a rental (borrower or owner)
   */
  async cancelRental(id: string): Promise<Rental> {
    const response = await api.post(`/rentals/${id}/cancel`);
    return response.data;
  },
};