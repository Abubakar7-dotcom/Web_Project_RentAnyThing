import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { createListing } from '../services/listingService';

// Static category definitions
const categoryDefinitions = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Tools', icon: '🔧' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Cameras', icon: '📷' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Music', icon: '🎸' },
  { name: 'Outdoor', icon: '⛺' },
  { name: 'Party', icon: '🎉' },
];

export function RentOutPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    pricePerDay: '',
    depositAmount: '',
    location: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = 'Price must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const listingData = {
        title: formData.title.trim(),
        category: formData.category,
        pricePerDay: parseFloat(formData.pricePerDay),
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : 0,
        location: formData.location.trim(),
        description: formData.description.trim(),
        mediaUrls: [], // TODO: Handle image uploads in future
      };

      await createListing(listingData);
      
      // Success - navigate to dashboard
      navigate('/app');
    } catch (error: any) {
      console.error('Error creating listing:', error);
      
      // Handle validation errors from API
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ 
          general: error.response?.data?.error || 'Failed to create listing. Please try again.' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">List Your Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}
          <div className="bg-card border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Product Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Canon EOS R5 Camera"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="">Select a category</option>
              {categoryDefinitions.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Daily Rental Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              {errors.pricePerDay && <p className="text-destructive text-sm mt-1">{errors.pricePerDay}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Deposit Amount (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item, its condition, and any special features..."
              rows={6}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
            />
            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-card border border-border hover:border-accent rounded-lg transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 font-medium"
            >
              {isSubmitting ? 'Creating...' : 'List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
