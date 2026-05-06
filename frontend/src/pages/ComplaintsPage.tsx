import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flag, AlertCircle, CheckCircle } from 'lucide-react';
import * as complaintService from '../services/complaintService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ComplaintsPage() {
  const [searchParams] = useSearchParams();
  const prefilledListingId = searchParams.get('listingId');

  const [reportType, setReportType] = useState<'user' | 'listing'>('listing');
  const [description, setDescription] = useState('');
  const [reportedUserId, setReportedUserId] = useState('');
  const [listingId, setListingId] = useState(prefilledListingId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [complaints, setComplaints] = useState<complaintService.Complaint[]>([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoadingComplaints(true);
      const data = await complaintService.getComplaints();
      setComplaints(data);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!description.trim()) {
      setSubmitError('Description is required');
      return;
    }

    if (description.trim().length < 10) {
      setSubmitError('Description must be at least 10 characters');
      return;
    }

    if (reportType === 'user' && !reportedUserId.trim()) {
      setSubmitError('User ID is required');
      return;
    }

    if (reportType === 'listing' && !listingId.trim()) {
      setSubmitError('Listing ID is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const data: any = {
        description: description.trim(),
      };

      if (reportType === 'user') {
        data.reportedUserId = reportedUserId.trim();
      } else {
        data.listingId = listingId.trim();
      }

      const newComplaint = await complaintService.submitComplaint(data);
      setComplaints([newComplaint, ...complaints]);
      setSubmitSuccess(true);
      setDescription('');
      setReportedUserId('');
      if (!prefilledListingId) {
        setListingId('');
      }

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setSubmitError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'OPEN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full">
          <AlertCircle className="w-3 h-3" />
          Open
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full">
        <CheckCircle className="w-3 h-3" />
        Resolved
      </span>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Flag className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Submit a Complaint</h1>
        </div>

        {/* Submit Form */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3">Report Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setReportType('listing')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    reportType === 'listing'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card border-border hover:border-accent'
                  }`}
                >
                  Report Listing
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('user')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    reportType === 'user'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card border-border hover:border-accent'
                  }`}
                >
                  Report User
                </button>
              </div>
            </div>

            {/* Conditional ID Input */}
            {reportType === 'user' ? (
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <input
                  type="text"
                  value={reportedUserId}
                  onChange={(e) => setReportedUserId(e.target.value)}
                  placeholder="Enter the user ID to report"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Listing ID</label>
                <input
                  type="text"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  placeholder="Enter the listing ID to report"
                  disabled={!!prefilledListingId}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail (minimum 10 characters)..."
                rows={6}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {description.length} / 10 minimum characters
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {submitError}
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                Complaint submitted successfully! We'll review it shortly.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* My Complaints */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">My Complaints</h2>

          {isLoadingComplaints ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : complaints.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              You haven't submitted any complaints yet.
            </p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(complaint.status)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {complaint.reportedUser && (
                        <p className="text-sm text-muted-foreground">
                          Reported User: <span className="font-medium">{complaint.reportedUser.name}</span>
                        </p>
                      )}
                      {complaint.listing && (
                        <p className="text-sm text-muted-foreground">
                          Reported Listing: <span className="font-medium">{complaint.listing.title}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{complaint.description}</p>
                  {complaint.resolvedAt && (
                    <p className="text-xs text-green-500 mt-2">
                      Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
