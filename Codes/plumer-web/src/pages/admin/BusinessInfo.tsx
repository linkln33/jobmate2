import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Form validation schema
const businessInfoSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  about: z.string().min(10, 'About section is required'),
  hours: z.string().min(5, 'Business hours are required'),
  serviceAreas: z.string().min(5, 'Service areas are required'),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

const BusinessInfo: React.FC = () => {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
  });

  // Fetch business info on component mount
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('business_info')
          .select('*')
          .single();

        if (error) throw error;
        
        if (data) {
          reset(data);
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [supabase, reset]);

  const onSubmit = async (data: BusinessInfoFormValues) => {
    setSaveStatus('saving');
    
    try {
      const { error } = await supabase
        .from('business_info')
        .upsert(data, { onConflict: 'id' });

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error updating business info:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your business details that appear on the website
        </p>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-4">Loading business information...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Plumer Pro"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="(123) 456-7890"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="info@plumerpro.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Hours */}
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                  Business Hours
                </label>
                <input
                  type="text"
                  id="hours"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Mon-Fri: 8am - 6pm, Sat: 9am - 3pm"
                  {...register('hours')}
                />
                {errors.hours && (
                  <p className="mt-1 text-sm text-red-600">{errors.hours.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="123 Plumbing Ave"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Plumberville"
                  {...register('city')}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="CA"
                  {...register('state')}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              {/* ZIP */}
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="12345"
                  {...register('zip')}
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
                )}
              </div>

              {/* Service Areas */}
              <div className="md:col-span-2">
                <label htmlFor="serviceAreas" className="block text-sm font-medium text-gray-700">
                  Service Areas
                </label>
                <input
                  type="text"
                  id="serviceAreas"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Plumberville, Pipetown, Drainville, and surrounding areas"
                  {...register('serviceAreas')}
                />
                {errors.serviceAreas && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceAreas.message}</p>
                )}
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About Your Business
                </label>
                <textarea
                  id="about"
                  rows={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Tell customers about your plumbing business..."
                  {...register('about')}
                ></textarea>
                {errors.about && (
                  <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>
                )}
              </div>
            </div>

            {/* Save Status */}
            {saveStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                Business information updated successfully!
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                Failed to update business information. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saveStatus === 'saving' || !isDirty}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  (saveStatus === 'saving' || !isDirty) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
