import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Types
type ImageItem = {
  id: string;
  url: string;
  name: string;
  category: 'hero' | 'team' | 'services' | 'gallery';
  created_at: string;
};

const Gallery: React.FC = () => {
  const { supabase } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'hero' | 'team' | 'services' | 'gallery'>('gallery');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch images on component mount and when category changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('category', selectedCategory)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load images. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [supabase, selectedCategory]);

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${selectedCategory}/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');

        // Save image record to database
        const { error: dbError } = await supabase.from('images').insert([
          {
            url: publicUrlData.publicUrl,
            name: file.name,
            category: selectedCategory,
          },
        ]);

        if (dbError) throw dbError;
      }

      // Refresh images
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);

      setMessage({
        type: 'success',
        text: 'Images uploaded successfully!',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({
        type: 'error',
        text: 'Failed to upload images. Please try again.',
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle image deletion
  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Extract path from URL
      const urlParts = url.split('/');
      const filePath = `${selectedCategory}/${urlParts[urlParts.length - 1]}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update state
      setImages(images.filter(image => image.id !== id));
      
      setMessage({
        type: 'success',
        text: 'Image deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete image. Please try again.',
      });
    }
  };

  // Image categories
  const categories = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'team', label: 'Team Members' },
    { value: 'services', label: 'Services' },
    { value: 'gallery', label: 'Gallery' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Image Gallery</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage images for your website
          </p>
        </div>
        
        <div className="p-6">
          {/* Category Selector */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Select Image Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === category.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Images
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span>Select Files</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {uploading ? 'Uploading...' : 'JPG, PNG, GIF up to 10MB'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Image Grid */}
          {loading ? (
            <div className="text-center py-12">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload images to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(image.id, image.url)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-2 text-sm truncate bg-white">
                    {image.name.length > 20
                      ? `${image.name.substring(0, 20)}...`
                      : image.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Image Usage Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Hero Section</h5>
            <p className="text-gray-600 text-sm">
              Upload images for the hero section of your homepage. These should be high-quality, professional images that represent your plumbing services.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Team Members</h5>
            <p className="text-gray-600 text-sm">
              Upload professional headshots of your team members. Consistent size and style is recommended.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Services</h5>
            <p className="text-gray-600 text-sm">
              Upload images that represent each of your plumbing services. These will be displayed in the services section.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Gallery</h5>
            <p className="text-gray-600 text-sm">
              Upload images of completed projects, before/after photos, or any other images you'd like to showcase in your gallery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
