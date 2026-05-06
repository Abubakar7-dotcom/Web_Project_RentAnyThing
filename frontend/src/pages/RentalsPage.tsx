import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rentalService, type Rental } from '../services/rentalService';
import { paymentService } from '../services/paymentService';
import { LoadingSpinner } from '../components/LoadingSpinner';

const statusConfig = {
  PENDING: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Pending', icon: Clock },
  ACTIVE: { color: 'text-green-600 bg-green-50 border-green-200', label: 'Active', icon: CheckCircle },
  COMPLETED: { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Completed', icon: CheckCircle },
  CANCELLED: { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Cancelled', icon: XCircle },
};

export function RentalsPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedRentals = await rentalService.getRentals();
      setRentals(fetchedRentals);
    } catch (err: any) {
      console.error('Error fetching rentals:', err);
      setError(err.response?.data?.error || 'Failed to fetch rentals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (rentalId: string) => {
    try {
      setActionLoading(rentalId);
      await rentalService.approveRental(rentalId);
      await fetchRentals(); // Refresh the list
    } catch (err: any) {
      console.error('Error approving rental:', err);
      alert(err.response?.data?.error || 'Failed to approve rental');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (rentalId: string) => {
    try {
      setActionLoading(rentalId);
      await rentalService.completeRental(rentalId);
      await fetchRentals(); // Refresh the list
    } catch (err: any) {
      console.error('Error completing rental:', err);
      alert(err.response?.data?.error || 'Failed to complete rental');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (rentalId: string) => {
    if (!confirm('Are you sure you want to cancel this rental?')) return;
    
    try {
      setActionLoading(rentalId);
      await rentalService.cancelRental(rentalId);
      await fetchRentals(); // Refresh the list
    } catch (err: any) {
      console.error('Error cancelling rental:', err);
      alert(err.response?.data?.error || 'Failed to cancel rental');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (rentalId: string) => {
    try {
      setActionLoading(rentalId);
      await paymentService.pay(rentalId);
      await fetchRentals(); // Refresh the list
      alert('Payment processed successfully!');
    } catch (err: any) {
      console.error('Error processing payment:', err);
      alert(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setActionLoading(null);
    }
  };

  const isOwner = (rental: Rental) => rental.listing.owner?.id === user?.id;
  const isBorrower = (rental: Rental) => rental.borrowerId === user?.id;

  const hasPaidPayment = (rental: Rental) => 
    rental.payment?.status === 'PAID';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error loading rentals</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchRentals}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Rentals</h1>

        {rentals.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No rentals yet</h2>
            <p className="text-muted-foreground">
              Start browsing items to rent or list your own items for others to rent.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {rentals.map((rental) => {
              const StatusIcon = statusConfig[rental.status].icon;
              const imageUrl = rental.listing.media?.[0]?.url || 
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80';

              return (
                <div key={rental.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={rental.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{rental.listing.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                            <User className="w-4 h-4" />
                            <span>
                              {isOwner(rental) ? `Rented by ${rental.borrower.name}` : 
                               `Owned by ${rental.listing.owner?.name || 'Owner'}`}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusConfig[rental.status].color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig[rental.status].label}
                        </div>
                      </div>

                      {/* Rental Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Duration</div>
                          <div className="font-medium">
                            {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Total Price</div>
                          <div className="font-medium text-primary">${rental.totalPrice}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Payment Status</div>
                          <div className={`font-medium ${hasPaidPayment(rental) ? 'text-green-600' : 'text-yellow-600'}`}>
                            {hasPaidPayment(rental) ? 'Paid' : 'Pending'}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {/* Owner Actions */}
                        {isOwner(rental) && rental.status === 'PENDING' && (
                          <button
                            onClick={() => handleApprove(rental.id)}
                            disabled={actionLoading === rental.id}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                          >
                            {actionLoading === rental.id ? 'Approving...' : 'Approve'}
                          </button>
                        )}

                        {isOwner(rental) && rental.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleComplete(rental.id)}
                            disabled={actionLoading === rental.id}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                          >
                            {actionLoading === rental.id ? 'Completing...' : 'Mark Complete'}
                          </button>
                        )}

                        {/* Borrower Actions */}
                        {isBorrower(rental) && rental.status === 'ACTIVE' && !hasPaidPayment(rental) && (
                          <button
                            onClick={() => handlePay(rental.id)}
                            disabled={actionLoading === rental.id}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                          >
                            {actionLoading === rental.id ? 'Processing...' : 'Pay Now'}
                          </button>
                        )}

                        {/* Cancel Action (for both owner and borrower on pending rentals) */}
                        {rental.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(rental.id)}
                            disabled={actionLoading === rental.id}
                            className="px-4 py-2 bg-destructive hover:bg-destructive/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                          >
                            {actionLoading === rental.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}