import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    pricePerDay: '',
    depositAmount: '',
    location: '',
    description: '',
  });
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Convert file to base64 data URL for preview (stored as URL)
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setMediaUrls((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      setErrors((prev) => ({ ...prev, url: 'Please enter a valid URL starting with http' }));
      return;
    }
    setMediaUrls((prev) => [...prev, trimmed]);
    setUrlInput('');
    setErrors((prev) => { const e = { ...prev }; delete e.url; return e; });
  };

  const removeImage = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim() || formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) newErrors.pricePerDay = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Filter out base64 data URLs — only send http URLs to the backend
      const httpUrls = mediaUrls.filter((url) => url.startsWith('http'));

      await createListing({
        title: formData.title.trim(),
        category: formData.category,
        pricePerDay: parseFloat(formData.pricePerDay),
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : 0,
        location: formData.location.trim(),
        description: formData.description.trim(),
        mediaUrls: httpUrls,
      });

      navigate('/app');
    } catch (error: any) {
      console.error('Error creating listing:', error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => { apiErrors[err.field] = err.message; });
        setErrors(apiErrors);
      } else {
        setErrors({ general: error.response?.data?.error || 'Failed to create listing. Please try again.' });
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

          {/* Image Upload Area */}
          <div>
            <label className="block mb-2 font-medium">Photos</label>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent'
              }`}
            >
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* URL input */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                placeholder="Or paste an image URL (https://...)"
                className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-card border border-border hover:border-accent rounded-lg text-sm transition-colors"
              >
                Add URL
              </button>
            </div>
            {errors.url && <p className="text-destructive text-sm mt-1">{errors.url}</p>}

            {/* Image previews */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                {/* Add more placeholder */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            )}
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
