import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Types
type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  price_type: 'fixed' | 'starting_at' | 'hourly';
  image_url?: string;
  is_featured: boolean;
  created_at: string;
};

// Form validation schema
const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  price_type: z.enum(['fixed', 'starting_at', 'hourly']),
  image_url: z.string().optional(),
  is_featured: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const Services: React.FC = () => {
  const { supabase } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([]);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any, // Type assertion to fix resolver compatibility
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      price_type: 'fixed',
      image_url: '',
      is_featured: false,
    },
  });

  // Fetch services and images on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Fetch service images
        const { data: imagesData, error: imagesError } = await supabase
          .from('images')
          .select('id, url, name')
          .eq('category', 'services');

        if (imagesError) throw imagesError;
        setImages(imagesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load services. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Handle form submission for creating/updating a service
  const onSubmit = async (data: ServiceFormValues): Promise<void> => {
    try {
      if (isEditing && currentServiceId) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', currentServiceId);

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Service updated successfully!',
        });

        // Update local state
        setServices(services.map(service => 
          service.id === currentServiceId ? { ...service, ...data } : service
        ));
      } else {
        // Create new service
        const { data: newService, error } = await supabase
          .from('services')
          .insert([data])
          .select();

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Service created successfully!',
        });

        // Update local state
        if (newService) {
          setServices([...newService, ...services]);
        }
      }

      // Reset form and state
      reset();
      setIsEditing(false);
      setCurrentServiceId(null);
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage({
        type: 'error',
        text: `Failed to ${isEditing ? 'update' : 'create'} service. Please try again.`,
      });
    }
  };

  // Handle editing a service
  const handleEdit = (service: Service) => {
    setIsEditing(true);
    setCurrentServiceId(service.id);
    
    // Set form values
    setValue('name', service.name);
    setValue('description', service.description);
    setValue('price', service.price);
    setValue('price_type', service.price_type);
    setValue('image_url', service.image_url || '');
    setValue('is_featured', service.is_featured);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle deleting a service
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setServices(services.filter(service => service.id !== id));
      
      setMessage({
        type: 'success',
        text: 'Service deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete service. Please try again.',
      });
    }
  };

  // Format price display
  const formatPrice = (price: number, priceType: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

    switch (priceType) {
      case 'starting_at':
        return `Starting at ${formattedPrice}`;
      case 'hourly':
        return `${formattedPrice}/hour`;
      default:
        return formattedPrice;
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., Drain Cleaning"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="99.99"
                    {...register('price')}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price_type" className="block text-sm font-medium text-gray-700">
                    Price Type
                  </label>
                  <select
                    id="price_type"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    {...register('price_type')}
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_at">Starting At</option>
                    <option value="hourly">Hourly Rate</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                  Service Image
                </label>
                <select
                  id="image_url"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  {...register('image_url')}
                >
                  <option value="">Select an image</option>
                  {images.map((image) => (
                    <option key={image.id} value={image.url}>
                      {image.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Upload service images in the Gallery section first
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Describe the service..."
                  {...register('description')}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    id="is_featured"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    {...register('is_featured')}
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Service (displayed prominently on homepage)
                  </label>
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                    setCurrentServiceId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isEditing ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Services</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No services found. Add your first service above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {service.image_url && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={service.image_url}
                              alt={service.name}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(service.price, service.price_type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.is_featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
