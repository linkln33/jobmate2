import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your full address" }),
  service: z.string().min(1, { message: "Please select a service" }),
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = (data: BookingFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitting(false);
      setIsSubmitted(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section id="booking" className="section bg-light relative overflow-hidden">
      <div className="container">
        <h2 className="section-title">Book a Plumber</h2>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Fill out the form below to schedule a service appointment. We'll get back to you promptly to confirm your booking.
        </p>
        
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg shadow-md mb-8">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-lg">Booking Request Received!</h3>
              </div>
              <p>Thank you for choosing Plumer Pro. We'll contact you shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="john@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="(123) 456-7890"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block mb-2 font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={`w-full p-3 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123 Main St, City, State, ZIP"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="service" className="block mb-2 font-medium">
                    Service Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service"
                    className={`w-full p-3 border rounded-md ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('service')}
                  >
                    <option value="">Select a service</option>
                    <option value="drain-cleaning">Drain Cleaning</option>
                    <option value="leak-repair">Leak Detection & Repair</option>
                    <option value="emergency">Emergency Plumbing</option>
                    <option value="water-heater">Water Heater Service</option>
                    <option value="pipe-repair">Pipe Repair & Replacement</option>
                    <option value="fixture-installation">Fixture Installation</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="date" className="block mb-2 font-medium">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    className={`w-full p-3 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="time" className="block mb-2 font-medium">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="time"
                    className={`w-full p-3 border rounded-md ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('time')}
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block mb-2 font-medium">
                    Problem Description
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Please describe your plumbing issue in detail..."
                    {...register('message')}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 text-center">
                By submitting this form, you agree to our terms of service and privacy policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
