import api from './api';

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  rental: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    listing: {
      id: string;
      title: string;
      pricePerDay: number;
      media: Array<{
        id: string;
        url: string;
        type: string;
      }>;
    };
    borrower?: {
      id: string;
      name: string;
    };
  };
}

export const paymentService = {
  /**
   * Process payment for a rental
   */
  async pay(rentalId: string): Promise<Payment> {
    const response = await api.post(`/payments/${rentalId}/pay`);
    return response.data;
  },

  /**
   * Get all payments for the authenticated user
   */
  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/payments');
    return response.data;
  },

  /**
   * Get a specific payment
   */
  async getPayment(id: string): Promise<Payment> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};